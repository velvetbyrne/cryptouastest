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

### Smart Contract
Smart Contract membantu dalam menangani pembelian, pendaftaran barang dan transfer kepemilikan barang di blockchain. Karena Smart Contract ini untuk toko online, transfer kepemilikan hanya antara vendor dan pengguna. Pengguna tidak dapat membeli barang dari pengguna lain.
```
event CreateItem(address  indexed creator,  uint256 itemId);
event ErrorItemNotAvailable(address  indexed buyer,  uint256 itemId);
event ErrorNotEnoughMoney(address  indexed buyer,  uint256 itemId);
event BuyItem(address  indexed buyer,  uint256 itemId);
```
Pada awal smart contract, ada empat event untuk smart contract yaitu ``CreateItem`` yang membantu dalam menambahkan item ke dalam database, ``ErrorItemNotAvailable`` yang membantu dalam menangani kesalahan ketika item dalam database tidak lagi tersedia. ``ErrorNotEnoughMoney`` membantu menangani ketika orang yang membeli tidak memiliki cukup token di dompet mereka. Lalu ada juga ``BuyItem`` yang membantu untuk pembelian produk dari toko.
```
struct Item {
	uint256 id;
	string name;
	uint256 price;  //Price in SD7
	ItemStatus itemStatus;
	address seller;
	address buyer;
	string imgPath;
}
```
Struct untuk satu produk di dalam toko, struct ini terdiri dari properti-properti untuk sebuah item di dalam database toko. ID akan di hitung oleh ``itemCounter`` saat item di tambah ke dalam database.
```
enum ItemStatus {Available, Purchased, Unavailable}
mapping  (address => uint256[])  private userItems;
mapping(uint256 => Item) items;
uint256[] itemList;
```
Menyiapkan status untuk item untuk menunjukan status ``Available``, ``Purchased`` atau ``Unavailable``. ``Available`` berarti produk daapt dibeli,``Purchased`` berarti sudah dibeli dan ``Unavailable`` berarti barang sudah dibeli oreh pembeli lain. Mapping ``userItems`` dan ``items`` ada untuk menyimpan barang-barang milik pengguna dan toko. Semua barang yang di toko ini yang sudah dibeli atau masih ada stock di simpan di dalam ``itemList``.
```
constructor()  public  {
	itemCounter =  0;
	createItem("HGFC Death Army",  15,  "hgfc_deatharmy004.jpg");
	...
}
```
Constructor ini terdapat untuk menyimpan barang-barang yang terdapat di toko ini. ``itemCounter`` ada untuk memulai hitungan id item dari 0, saat item id tambah maka counter akan naik.
```
uint256 itemCounter;
function getItemId()  private  returns(uint)  {  return  ++itemCounter;  }
```
``itemCounter`` berbentuk uint256. Selain itu terdapat function getItemId untuk mendapatkan id dari barang yang di dalam database yang dimasukan menggunakan fungsi ``createItem``.
```
function createItem (string memory _name,uint256 _price,string memory _imgPath) public returns(bool success) {
        uint256 itemId = getItemId();
        Item memory item = items[itemId];
        item.id = itemId;
        item.name = _name;
        item.price = _price;
        item.imgPath = _imgPath;
        item.seller = msg.sender;
        items[itemId] = item;
        item.itemStatus = Gunpla.ItemStatus.Available;
        
        itemList.push(itemId);
        emit CreateItem(msg.sender, item.id);
        return true;
    }
  ```
  Fungsi ``addItem`` digunakan untuk menambahkan barang ke dalam toko. Item yang di masukan menggunakan parameter-parameter yang sudah di setting menggunakan constructor sebelum nya. Di ``item.itemStatus``, status item akan secara otomatis di setting sebagai ``Available``.
```
function getAllItemList() public view returns(uint256[] memory _items){
        return itemList;
    }
```
Function ``getAllItemList`` dapat dipanggil untuk mengambil kembali semua barang yang ada di dalam ``itemList``.
```
function getItemById(uint256 _id) private view returns(Item memory item){
        return items[_id];
    }
```
Function ``getItemById`` dapat dipanggil untuk mencari barang dari id barang tersebut.
```
function getMyItem()  public  view  returns(uint256[]  memory item){
	return userItems[msg.sender];
}
```
Function ``getMyItem`` membantu untuk memanggil semua barang yang dimiliki oleh pengguna.
```
Function getItemStrById(uint256 _id) public view returns(uint256 id, string memory name, uint256 price,string memory status,address seller,address buyer,string memory imgPath ){
        Item memory i = getItemById(_id);

        string memory statusTemp;
        if(i.itemStatus == ItemStatus.Available){
            statusTemp = "Available";
        }else if(i.itemStatus == ItemStatus.Purchased){
            statusTemp = "Purchased";
        }else if(i.itemStatus == ItemStatus.Purchased){
            statusTemp = "Unavailable";
        }else{
            statusTemp = "unnamed";
        }
        return (i.id,i.name,i.price,statusTemp,i.seller,i.buyer,i.imgPath);
    }
```
Function ``getItemByStrId`` secara otomatis mengganti status barang. ``Available`` jika barang masih di jual, ``Purchased`` jika barang sudah dibeli oleh pengguna, ``Unavailable`` jika produk sudah di beli oleh orang lain atau stock sedang habis dan ``unnamed`` digunakan sebagai error case.
```
function buyItem (uint256 _itemId) public payable returns(bool success){
        Item memory i = getItemById(_itemId);

        if(i.itemStatus != ItemStatus.Available){
            emit ErrorItemNotAvailable(msg.sender,_itemId);
            msg.sender.transfer(msg.value);
            return false;
        }
```
Function ``buyItem`` digunakan saat produk ingin dibeli oleh pengguna. Jika ``ItemStatus`` tidak ``Available``, maka akan di emit error bahwa item tidak dapat beli.
```
				if(msg.value <= i.price){
            emit ErrorNotEnoughMoney(msg.sender,_itemId);
            msg.sender.transfer(msg.value);
            return false;
        }
```
Jika Token milik pengguna tidak cukup untuk membeli produk yang ingin dibeli, maka pengguna akan mendapatkan error yang menunjukan bahwa mereka tidak mempunyai token yang cukup untuk membeli barang.
```
		i.buyer = msg.sender;
        i.itemStatus = Gunpla.ItemStatus.Purchased;
        items[_itemId] = i;
        userItems[msg.sender].push(i.id);
        emit BuyItem(msg.sender,i.id);
        return true;
    }
```
Jika semua kondisi terpenuhi untuk membeli produk, maka item tersebut akan di transfer ke pengguna.
## Website
Website ini untuk tampilan utama toko termasuk menampilkan barang-barang serta memungkinkan pengguna untuk menghubungkan dompet metamask mereka ke situs web untuk membeli barang yang mereka inginkan.
```
import {
  useConnect, 
  useAccount, 
  InjectedConnector, 
  chain, 
  useBalance,
  useContractRead,
  useContractWrite
} from "wagmi";
```
Pada bagian pertama, kami mengimpor fungsi dari ``wagmi ethers`` untuk menjalankan fungsi-fungsi yang diperlukan untuk menangani transaksi yang dilakukan dengan ethereum.
```
const metamaskConnector = new InjectedConnector ({
  chains: [chain.kovan],
})
```
``metamaskConnector`` digunakan untuk membantu terhubung dengan jaringan tertentu, dalam hal ini ``metamaskConnector`` hanya akan terhubung ke dompet di Kovan Test Network.
```
function App() {
  const [connectResult, connect] = useConnect();
  const [accountResult, disconnect] = useAccount();
```
``connectResult`` dan ``useAccount`` ini digunakkan untuk menghubungkan dan men-disconnect wallet dari website.
```
const [etherBalance] = useBalance({
    addressOrName: accountResult.data?.address
  })
```
``etherBalance`` ini mengambil balance Ethereum yang ada di wallet Metamask pengguna dengan melihat address Metamask pengguna. Dengan ini, website dapat menampilkan jumlah Ethereum yang di miliki oleh pengguna.
```
const [sd7Balance] = useBalance({
    addressOrName: accountResult.data?.address,
    token: "0xa5ef99fe776cf743530cc96eb0a9aeb22a46accb10fb796302554e423cfe41e3"
  })
```
``sd7Balance`` ini memiliki fungsi yang sama dengan fungsi ``etherBalance`` namun menunjukan jumlah token SD7 yang di miliki oleh pengguna. ``token:`` tersebut mengarahkan ke address yang dimiliki oleh contract SD7 tersebut.
```
const [error, setError] = useState ("");
  const connectMetamask = async() => {
    try{
      const result = await connect(metamaskConnector)
      if(result.data.chain.unsupported){
        throw new Error("Network not supported!")
      }
    } catch (err) {
      setError(err.message)
    }
  }
```
Fungsi ``error`` ini akan menunjukan teks *"Network not supported!"* jika wallet yang terhubung tidak menggunakan Kovan Test Network.
```
{connectResult.data.connected ?
      <div>
        <table>
          <tr>
            <th>Logo</th>
            <th>ETH: {etherBalance.data?.formatted} {etherBalance.data?.symbol}</th>
            <th>SD7: {sd7Balance.data?.formatted} {sd7Balance.data?.symbol}</th>
            <th><button class="ButtonStyle" onClick={disconnect}>Disconnect</button></th>
          </tr>
        </table>
        <br/>
      </div>:
      <table>
      <tr>
        <th>Logo</th>
        <th>ETH: Not Connected</th>
        <th>SD7: Not Connected</th>
        <th><button class="ButtonStyle" onClick={connectMetamask}>Connect Wallet</button></th>
      </tr>
    </table>
      }
```
Blok kode ini berisi bagian dari fungsionalitas untuk menghubungkan dompet Metamask dengan situs web. Ketika situs web tidak terhubung ke dompet, maka akan muncul *"Not Connected "* di ETH dan SD7. Namun jika dompet Metamask telah terhubung, maka bagian atas akan menunjukkan saldo untuk ETH dan token SD7 pada header.
