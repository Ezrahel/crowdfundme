package wallet

var CreateWalletTable = `CREATE TABLE IF NOT EXISTS wallets(
id UUID PRIMARY KEY,
owner_type VARCHAR(30) CHECK (owner_type IN ('user', 'campaign', 'platform'))
owner_id UUID,
balance NUMERIC(12,2) DEFAULT 0,
currency VARCHAR(6) DEFAULT 'NGN',
created_at TIMESTAMP DEFAULT NOW()
)`

var TransactionTabel = `CREATE TABLE IF NOT EXISTS transaction (
id UUID PRIMARY KEY,
transaction_type VARCHAR(30) CHECK (
	transaction_type IN ('donation', 'platform_fee', 'withdrawal', 'reversal'
	)
	),
camapaign_id UUID REFERENCES campaign(id),
wallet_id UUID REFERENCE wallets(id),
amount NUMERIC(12,2),
donor_name VARCHAR(150),
reference_id VARCHAR(150),
metadata JSONB,
created_at TIMESTAMP DEFAULT NOW()
)`

func AccountNumber() {

}
