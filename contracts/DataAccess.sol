pragma solidity ^0.4.18;

contract DataAccess {

    // This declares a new complex type which
    // will be used for variables
    // it represents a single usersData
    struct DataLocation {
        string ownerName;
        string institution;
        string bgChainToken;
        string dateOfAccess;
        string projectSummary;
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
        string institution,
        string bgChainToken,
        string dateOfAccess,
        string projectSummary,
       // uint accessCount,
        uint index);


    // event for new updated data  location 
    event LogUpdateData   (
        address indexed dataAddress,
        string ownerName,
        string institution,
        string bgChainToken,
        string dateOfAccess,
        string projectsSummary,
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
        string _institution,
        string _bgChainToken,
        string _dateOfAccess,
        string _projectSummary)

        public returns(uint index)
        {
            if(validateData(dataAddress)) revert();
        datastores[dataAddress].ownerName = _ownerName;
        datastores[dataAddress].institution = _institution;
        datastores[dataAddress].bgChainToken = _bgChainToken;
        datastores[dataAddress].dateOfAccess = _dateOfAccess;
        datastores[dataAddress].projectSummary = _projectSummary;
        datastores[dataAddress].accessCount=1;
        datastores[dataAddress].index = userIndex.push(dataAddress)-1;
        LogNewData(
            dataAddress,  
            _ownerName,
            _institution,
            _bgChainToken,
            _dateOfAccess,
            _projectSummary,
            datastores[dataAddress].index);
            return userIndex.length-1;
        }


    // function to get data stored in contract
    function getData(address dataAddress)
        public 
        constant
        returns(
        string ownerName,
        string institution,
        string bgChainToken,
        string dateOfAccess,
        string projectSummary,
        uint index)
    {
        if(!validateData(dataAddress)) revert(); 
        return(
            datastores[dataAddress].ownerName,
            datastores[dataAddress].institution,
            datastores[dataAddress].bgChainToken,
            datastores[dataAddress].dateOfAccess,
            datastores[dataAddress].projectSummary,
            datastores[dataAddress].index);
    }


    // Function updates data location
    function updateDataLocation(address _dataAddress, string _dateOfAccess, string _projectSummary,  string _bgChainToken) 
        public
        returns(bool success)
        {
            if(!validateData(_dataAddress)) revert();
            datastores[_dataAddress].dateOfAccess = _dateOfAccess;
            datastores[_dataAddress].projectSummary = _projectSummary;
            datastores[_dataAddress].bgChainToken = _bgChainToken;
            LogUpdateData(
                _dataAddress,
                datastores[_dataAddress].ownerName,
                datastores[_dataAddress].institution,
                _bgChainToken,
                _dateOfAccess,
                _projectSummary,
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

