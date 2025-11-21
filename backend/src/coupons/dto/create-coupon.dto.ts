export class CreateCouponDto {
    code: string;
    promotionId: string;
    singleUse: boolean;
    perUserLimit: number;
    expiresAt?: Date;
}
