export interface NotificationModel {
    ecommerceNotificationId: number,
    portalUserid: number,
    portalUser: string,
    message: string,
    isSeen: boolean,
    isDeleted: boolean,
    createdBy: string,
    createdDate: Date,
    modifiedDate: Date,
    referenceId: number,
    referenceType: number
}

export interface UserInfo {
    accountNum: string,
    companyName: string,
    customerAccountId: number,
    email: string,
    fullname: string,
    isActive: boolean,
    portalUserId: number,
    userLevel: string,
    userLevelId: number,
    username: string
}