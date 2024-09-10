export enum ApiError {
  RoomNotFound = '100',
  YouCanNotAccessToThisRoom = '101',
  UserAlreadyBannedFromThisRoom = '102',
  YouCanNotBanYourSelf = '103',
  RoomPermission = '104',
  YouAreNotInRoom = '105',

  //Internal server
  SomethingWentWrong = '501',
}
