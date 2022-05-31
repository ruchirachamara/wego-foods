export interface Food {
    id: string;
    index: number;
    rating: number;
    promotion: any;
    isNew: boolean;
    categoryId: string;
    minCookTime: number;
    maxCookTime: number;
    restaurant: string;
    name: string;
    imageUrl: string;
}

export interface Foods extends Array<Food>{}