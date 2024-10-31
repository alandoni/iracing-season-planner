import { MemberResponse } from "./member_response";
import { Package } from "./package";
export declare class LoggedUserResponse extends MemberResponse {
    on_car_name: string;
    last_test_track: number;
    last_test_car: number;
    last_season: number;
    account: {
        ir_dollars: number;
        ir_credits: number;
        status: string;
        country_rules: unknown;
    };
    suit: {
        pattern: 9;
        color1: "3ef035";
        color2: "0e5c0a";
        color3: "ffffff";
        body_type: 0;
    };
    car_packages: Package[];
    track_packages: Package[];
    other_owned_packages: number[];
}
