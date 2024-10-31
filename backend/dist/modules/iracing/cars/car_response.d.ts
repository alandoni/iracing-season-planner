export declare class CarResponse {
    ai_enabled: boolean;
    allow_number_colors: boolean;
    allow_sponsor1: boolean;
    allow_sponsor2: boolean;
    allow_wheel_color: boolean;
    award_exempt: boolean;
    car_dirpath: string;
    car_id: number;
    car_name: string;
    car_name_abbreviated: string;
    car_types: {
        car_type: string;
    }[];
    car_weight: number;
    categories: string[];
    created: Date;
    first_sale: Date;
    forum_url: string;
    free_with_subscription: boolean;
    has_headlights: boolean;
    has_multiple_dry_tire_types: boolean;
    has_rain_capable_tire_types: boolean;
    hp: number;
    is_ps_purchasable: boolean;
    max_power_adjust_pct: number;
    max_weight_penalty_kg: number;
    min_power_adjust_pct: number;
    package_id: number;
    paint_rules: Record<string, {
        PaintCarAvailable: boolean;
        Color1: string;
        Color2: string;
        Color3: string;
        Sponsor1Available: boolean;
        Sponsor2Available: boolean;
        Sponsor1: string;
        Sponsor2: string;
        RulesExplanation: string;
    }>;
    patterns: number;
    price: number;
    price_display: string;
    rain_enabled: boolean;
    retired: boolean;
    search_filters: string;
    sku: number;
}
