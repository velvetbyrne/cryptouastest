//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Gunpla {

    event CreateItem(address indexed creator, uint256 itemId);
    event ErrorItemNotAvailable(address indexed buyer, uint256 itemId);
    event ErrorNotEnoughMoney(address indexed buyer, uint256 itemId);
    event BuyItem(address indexed buyer, uint256 itemId);

    struct Item {
        uint256 id;
        string name;
        uint256 price; //Price in SD7
        string imgPath;
        ItemStatus itemStatus;
        address seller;
        address buyer;
    }

    enum ItemStatus {Available, Purchased, Unavailable}
    mapping (address => uint256[]) private userItems;
    mapping(uint256 => Item) items;
    uint256[] itemList;

    constructor() public {
        itemCounter = 0;
        createItem("HGFC Death Army", 15, "hgfc_deatharmy004.jpg");
        createItem("HGCE Freedom Gundam", 27, "hgce_freedom007.jpg");
        createItem("HGCE Lord Astray Omega", 54, "hgce_loadastray002.jpg");
        createItem("HGUC V-Dash Gundam", 24, "hguc_vdash197.jpg");
        createItem("HGFC Kampfer", 26, "hguc_kampfer002.jpg");
        createItem("HGUC Blue Destiny Unit-2", 27, "hguc_blue2006.jpg");
        createItem("HGUC Byralant", 33, "hguc_byarlant_003.jpg");
        createItem("HGUC The O", 33, "hguc_theo003.jpg");
        createItem("HGBD Try Age Gundam Magnum", 15, "hgbd_tryage004.jpg");
    }

    uint256 itemCounter;
    function getItemId() private returns(uint) { return ++itemCounter; }

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

    function getAllItemList() public view returns(uint256[] memory _items){
        return itemList;
    }

    function getItemById(uint256 _id) private view returns(Item memory item){
        return items[_id];
    }

    function getMyItem() public view returns(uint256[] memory item){
        return userItems[msg.sender];
    }

    function getItemStrById(uint256 _id) public view returns(uint256 id, string memory name, uint256 price,string memory status,address seller,address buyer,string memory imgPath ){
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
    
    function buyItem (uint256 _itemId) public payable returns(bool success){
        Item memory i = getItemById(_itemId);

        if(i.itemStatus != ItemStatus.Available){
            emit ErrorItemNotAvailable(msg.sender,_itemId);
            msg.sender.transfer(msg.value);
            return false;
        }

        if(msg.value <= i.price){
            emit ErrorNotEnoughMoney(msg.sender,_itemId);
            msg.sender.transfer(msg.value);
            return false;
        }
        
        i.buyer = msg.sender;
        i.itemStatus = Gunpla.ItemStatus.Purchased;
        items[_itemId] = i;
        userItems[msg.sender].push(i.id);
        emit BuyItem(msg.sender,i.id);
        return true;
    }
}