pragma solidity ^0.4.18;

contract DataAccess {

    // This declares a new complex type which
    // will be used for variables
    // it represents a single usersData
    struct DataLocation {
        string ownerName;
        string ownerID;
        string url;
        string dateOfAccess;
        string timeOfAccess;
        uint accessCount;
        uint index;
    }

    struct Index {
        uint indexLocation;
    }

    // store Data that has a location
    mapping(address => DataLocation) private datastores;

    mapping (address => uint) private balances;

    // store datalocation Count
    uint public datalocationsCount;

    // userIndex stors location of pointers
    address[] public userIndex;

    // stored event
    event storedEvent (
        uint indexed _dataLocationId
    );

    // event for new data location 
    event LogNewData   (
        address indexed dataAddress, 
        string ownerName,
        string url,
        string ownerID,
        string dateOfAccess,
        string timeOfAccess,
       // uint accessCount,
        uint index);


    // event for new updated data  location 
    event LogUpdateData   (
        address indexed dataAddress,
        string ownerName,
        string url,
        string ownerID,
        string dateOfAccess,
        string timeOfAccess,
     //   uint accessCount,
        uint index);
    
    function enroll() public returns (uint){
      /* Set the sender's balance to 1000, return the sender's balance */
        address user = msg.sender;
        
        balances[user] = 1000; 
        return user.balance;
    }


    function validateData(address dataAddress) 
        public 
        constant 
        returns(bool checkedOwner) {
            if(userIndex.length == 0) return false;
            return (userIndex[datastores[dataAddress].index] == dataAddress);
        }

    // function that adds initial dataLocation 
    function insertDataLocation (
        address dataAddress,
        string _ownerName,
        string _ownerID,
        string _url,
        string _dateOfAccess,
        string _timeOfAccess)

        public returns(uint index)
        {
            if(validateData(dataAddress)) {revert();}
        datastores[dataAddress].ownerName = _ownerName;
        datastores[dataAddress].ownerID   = _ownerID;
        datastores[dataAddress].url = _url;
        datastores[dataAddress].dateOfAccess = _dateOfAccess;
        datastores[dataAddress].timeOfAccess = _timeOfAccess;
        datastores[dataAddress].accessCount=1;
        datastores[dataAddress].index = userIndex.push(dataAddress)-1;
        LogNewData(
            dataAddress,  
            _ownerName,
            _url,
            _ownerID,
            _dateOfAccess,
            _timeOfAccess,
            datastores[dataAddress].index);
            return userIndex.length-1;
        }


    // function to get data stored in contract
    function getData(address dataAddress)
        public 
        constant
        returns(
        string ownerName,
        string ownerID,
        string url,
        string dateOfAccess,
        string timeOfAccess,
        uint index)
    {
        if(!validateData(dataAddress)) {revert();} 
        return(
            datastores[dataAddress].ownerName,
            datastores[dataAddress].ownerID,
            datastores[dataAddress].url,
            datastores[dataAddress].dateOfAccess,
            datastores[dataAddress].timeOfAccess,
            datastores[dataAddress].index);
    }


    // Function updates data location
    function updateDataLocation(address _dataAddress, string _dateOfAccess, string _timeOfAccess,  string _url) 
        public
        returns(bool success)
        {
            if(!validateData(_dataAddress)) {revert();}
            datastores[_dataAddress].dateOfAccess = _dateOfAccess;
            datastores[_dataAddress].timeOfAccess = _timeOfAccess;
            datastores[_dataAddress].url = _url;
            LogUpdateData(
                _dataAddress,
                datastores[_dataAddress].ownerName,
                _url,
                datastores[_dataAddress].ownerID,
                _dateOfAccess,
                _timeOfAccess,
                datastores[_dataAddress].index);
                return true;
        }

    // funtion to update Data owner - not sure of use case? //
      function getDataCount()
    public
    constant
    returns(uint count)
  {
    return userIndex.length;
  }

  function getUserAtIndex(uint index)
    public
    constant
    returns(address dataAddress)
  {
    return userIndex[index];
  }

}

