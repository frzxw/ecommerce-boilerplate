export enum PromotionType {
    PERCENT = 'PERCENT',
    AMOUNT = 'AMOUNT',
    FREE_SHIPPING = 'FREE_SHIPPING',
}

export class CreatePromotionDto {
    name: string;
    type: PromotionType;
    value?: number;
    startsAt?: Date;
    endsAt?: Date;
    active?: boolean;
}
