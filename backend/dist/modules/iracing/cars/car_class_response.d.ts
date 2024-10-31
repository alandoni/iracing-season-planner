export declare class CarClassResponse {
    car_class_id: number;
    cars_in_class: {
        car_dirpath: string;
        car_id: number;
        rain_enabled: boolean;
        retired: boolean;
    }[];
    cust_id: number;
    name: string;
    rain_enabled: boolean;
    relative_speed: number;
    short_name: string;
}
