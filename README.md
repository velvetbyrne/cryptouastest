# Laporan UAS Blockchain & Cryptocurrency
```
Name: Benjamin Jason Tantra
NIM: 00000037711
```
## Smart Contract
### Token
```
import  "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

```
Pertama mengimport ERC20Burnable.sol  dari openzeppelin. Contract solidity ERC20Burnable membantu dalam membuat struktur basic dari Token ERC20 dengan fungsi burnable yang dapat menghapus koin dari sirkulasi.

```
contract Side7Token is ERC20Burnable{

constructor(uint256 _initialSupply) ERC20("Side7",  "SD7")  {
	_mint(msg.sender, _initialSupply *  10**uint(decimals()));
}
```
Contract dimulai dengan membuat constructor untuk ``_initialSupply`` yang akan membantu kami membuat initial pool untuk token yang akan kami buat. ``ERC20("Side7",  "SD7")`` ini membantu mendefinisikan nama dan symbol untuk token yang kami buat.

```
event BuyTokens(address buyer,  uint256 amountOfETH,  uint256 amountOfTokens);
```
Event untuk membeli token yang mengambil address dari wallet pembeli, uint256 untuk jumlah Ethereum (ETH) yang ingin dipakai untuk membeli token and uint256 untuk jumlah token yang ingin dibeli.

```
function buyProduct()  public  payable  returns  (uint256 tokenAmount)  {

require(msg.value >  0,  "You must send ETH to purchase");
```
Function ``buyProduct`` ini terdapat untuk membeli token dari vendor. Ada requirement di awal untuk menjaminkan bahwa ada ETH yang dikirim dari wallet pembeli ke wallet vendor.
```
uint256 amountToBuy =  msg.value *  100;
uint256 vendorBalance = Side7Token.balanceOf(address(this));
require(vendorBalance >= amountToBuy,  "Not enough tokens in vendor's address");
```
amountToBuy adalah total jumlah yang ingin dibeli, vendorBalance adalah jumlah token ``Side7Token`` yang di miliki oleh vendor. Jika jumlah token yang ingin di beli lebih dari token yang ada di wallet Vendor, maka akan di munculkan error *"Not enough tokens in vendor's address."*
```
(bool sent)  = Side7Token.transfer(msg.sender, amountToBuy);
require(sent,  "Failed to transfer token");
emit BuyTokens(msg.sender,  msg.value, amountToBuy);
return amountToBuy;
```
Lalu setelah di konfirmasi bahwa token vendor dan ETH pembeli juga cukup, maka token dari vendor akan di transfer ke pembeli dan akan di emit hasil dari transaksi. Jika ada error di tengah-tengah transaksi, maka akan muncul error *"Failed to transfer token."* dan transaksi akan di berhentikan jika token atau ETH gagal untuk di kirim.
