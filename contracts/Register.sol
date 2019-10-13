pragma solidity ^0.4.18;

contract Register {

  struct EntityStruct {
    string entityData;
    bool isEntity;
  }

  mapping (address => EntityStruct) public entityStructs;

  function isEntity(address entityAddress) public constant returns(bool isIndeed) {
    return entityStructs[entityAddress].isEntity;
  }

  function newEntity(
          address entityAddress, 
          string _entityData) 
          public returns(bool success) {
    if(isEntity(entityAddress)) revert(); 
    
    entityStructs[entityAddress].entityData = _entityData;
    entityStructs[entityAddress].isEntity = true;
    EntityCreated(entityAddress, _entityData);
    return true;
  }

  function deleteEntity(address entityAddress) public returns(bool success) {
    if(!isEntity(entityAddress)) revert();
    entityStructs[entityAddress].isEntity = false;
    return true;
  }

  function updateEntity(address entityAddress, string entityData) public returns(bool success) {
    if(!isEntity(entityAddress)) revert();
    entityStructs[entityAddress].entityData = entityData;
    return true;
  }

  function getEntity(address entityAddress) public returns(string entityData) {
    if(!isEntity(entityAddress)) revert();
    return entityStructs[entityAddress].entityData = entityData;
  }
  /**
  * Events
  */
  event EntityCreated(address entityAddress, string entityData);


}