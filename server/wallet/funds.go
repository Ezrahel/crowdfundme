package wallet

const AccountTYPE (
	"Savings",
	"Current",
	"Business"
)
type Wallet struct{
	AccountName string	`json:"account_name"`
	BankName	string	`json:"bank_name"`
	AccountNumber	string	`json:"account_number"`
	AccountType	string	`json:"account_type"`
}
