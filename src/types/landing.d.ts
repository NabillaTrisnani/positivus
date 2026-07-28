export interface PartnerType {
    id: number;
    name: string;
    logo: string;
};

export interface ServiceType {
    id: number;
    cardBackground: string;
    headerText: string;
    headerTextColor: string;
    headerBackgroundColor: string;
    buttonIconColor: string;
    buttonFontColor: string;
    serviceIllustration: string;
};

export interface CaseStudyType {
    id: number;
    text: string;
};

export interface WorkingProcessType {
    id: number;
    title: string;
    description: string;
}

export interface TeamType {
    id: number;
    name: string;
    position: string;
    description: string;
    photo: string;
    linkedin: string;
}

export interface TestimonialType {
    id: number;
    name: string;
    position: string;
    company: string;
    testimony: string;
}

export interface SocialMediaType {
    id: number;
    link: string;
    platform: string;
}