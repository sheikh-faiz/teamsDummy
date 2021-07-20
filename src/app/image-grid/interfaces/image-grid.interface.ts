export interface ImageGrid {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

export interface TestListModel {
    examUniqueName: string;
    // languages: Languages[];
    minutesToComplete: number;
    overview: string;
    passPercentage: number;
    productId: string;
    productType: string;
    tags: Tags[];
    title: string;
    totalQuestions: number;
    totalSections: number;
    version?: null | string;
    examInstanceUniqueName: string;
    hasAssignedVoucher: boolean;
    hasInstanceNotCompleted: boolean;
    instruction?: null | string;
    isFree: boolean;
    canUseActivationCode: boolean;
    language: string;
    thumbnail: string;
  }

  export interface Tags { }

