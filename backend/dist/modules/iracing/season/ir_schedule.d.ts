export type IrSchedule = {
    season_id: number;
    race_week_num: number;
    car_restrictions: {
        car_id: number;
        max_dry_tire_sets: number;
        max_pct_fuel_fill: number;
        power_adjust_pct: number;
        race_setup_id: number;
        weight_penalty_kg: number;
    }[];
    category: string;
    category_id: number;
    enable_pitlane_collisions: boolean;
    full_course_cautions: boolean;
    qual_attached: boolean;
    race_lap_limit: number;
    race_time_descriptors: {
        day_offset: number[];
        first_session_time: string;
        repeat_minutes: number;
        repeating: boolean;
        session_minutes: number;
        start_date: Date;
        super_session: boolean;
    }[];
    race_time_limit: number | null;
    race_week_cars: {
        car_id: number;
    }[];
    restart_type: string;
    schedule_name: string;
    season_name: string;
    series_id: number;
    series_name: string;
    short_parade_lap: boolean;
    simulated_time_multiplier: number;
    special_event_type: unknown | null;
    start_date: Date;
    start_type: string;
    start_zone: boolean;
    track: {
        category: string;
        category_id: number;
        config_name: string;
        track_id: number;
        track_name: string;
    };
    track_state: {
        leave_marbles: boolean;
    };
    weather: {
        allow_fog: boolean;
        fog: number;
        forecast_options: {
            forecast_type: number;
            precipitation: number;
            skies: number;
            stop_precip: number;
            temperature: number;
            weather_seed: number;
            wind_dir: number;
            wind_speed: number;
        };
        precip_option: number;
        rel_humidity: number;
        simulated_start_time: Date;
        simulated_start_utc_time: Date;
        simulated_time_multiplier: number;
        simulated_time_offsets: number[];
        skies: number;
        temp_units: number;
        temp_value: number;
        time_of_day: number;
        type: number;
        version: number;
        weather_summary: {
            max_precip_rate: number;
            max_precip_rate_desc: string;
            precip_chance: number;
            skies_high: number;
            skies_low: number;
            temp_high: number;
            temp_low: number;
            temp_units: number;
            wind_high: number;
            wind_low: number;
            wind_units: number;
        };
        weather_url: string;
        weather_var_initial: number;
        weather_var_ongoing: number;
        wind_dir: number;
        wind_units: number;
        wind_value: number;
    };
};
