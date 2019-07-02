/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

export enum Merchant_AccountType {
    BUSINESS = "BUSINESS",
    LOCATION = "LOCATION"
}

export enum Merchant_AccountCapability {
    CREDIT_CARD_PROCESSING = "CREDIT_CARD_PROCESSING",
    EMPLOYEE_MANAGEMENT = "EMPLOYEE_MANAGEMENT",
    TIMECARD_MANAGEMENT = "TIMECARD_MANAGEMENT"
}

export enum Merchant_BusinessType {
    ACCOUNTING = "ACCOUNTING",
    APPAREL_AND_ACCESSORY_SHOPS = "APPAREL_AND_ACCESSORY_SHOPS",
    ART_DEALERS_GALLERIES = "ART_DEALERS_GALLERIES",
    ART_DESIGN_AND_PHOTOGRAPHY = "ART_DESIGN_AND_PHOTOGRAPHY",
    BAR_CLUB_LOUNGE = "BAR_CLUB_LOUNGE",
    BEAUTY_AND_BARBER_SHOPS = "BEAUTY_AND_BARBER_SHOPS",
    BOOK_STORES = "BOOK_STORES",
    BUSINESS_SERVICES = "BUSINESS_SERVICES",
    CATERING = "CATERING",
    CHARITABLE_SOCIAL_SERVICE_ORGANIZATIONS = "CHARITABLE_SOCIAL_SERVICE_ORGANIZATIONS",
    CHARITIBLE_ORGS = "CHARITIBLE_ORGS",
    CLEANING_SERVICES = "CLEANING_SERVICES",
    COMPUTER_EQUIPMENT_SOFTWARE_MAINTENANCE_REPAIR_SERVICES = "COMPUTER_EQUIPMENT_SOFTWARE_MAINTENANCE_REPAIR_SERVICES",
    CONSULTANT = "CONSULTANT",
    CONTRACTORS = "CONTRACTORS",
    DELIVERY_SERVICES = "DELIVERY_SERVICES",
    DENTISTRY = "DENTISTRY",
    EDUCATION = "EDUCATION",
    FOOD_STORES_CONVENIENCE_STORES_AND_SPECIALTY_MARKETS = "FOOD_STORES_CONVENIENCE_STORES_AND_SPECIALTY_MARKETS",
    FOOD_TRUCK_CART = "FOOD_TRUCK_CART",
    FURNITURE_HOME_AND_OFFICE_EQUIPMENT = "FURNITURE_HOME_AND_OFFICE_EQUIPMENT",
    FURNITURE_HOME_GOODS = "FURNITURE_HOME_GOODS",
    HOTELS_AND_LODGING = "HOTELS_AND_LODGING",
    INDIVIDUAL_USE = "INDIVIDUAL_USE",
    JEWELRY_AND_WATCHES = "JEWELRY_AND_WATCHES",
    LANDSCAPING_AND_HORTICULTURAL_SERVICES = "LANDSCAPING_AND_HORTICULTURAL_SERVICES",
    LANGUAGE_SCHOOLS = "LANGUAGE_SCHOOLS",
    LEGAL_SERVICES = "LEGAL_SERVICES",
    MEDICAL_PRACTITIONERS = "MEDICAL_PRACTITIONERS",
    MEDICAL_SERVICES_AND_HEALTH_PRACTITIONERS = "MEDICAL_SERVICES_AND_HEALTH_PRACTITIONERS",
    MEMBERSHIP_ORGANIZATIONS = "MEMBERSHIP_ORGANIZATIONS",
    MUSIC_AND_ENTERTAINMENT = "MUSIC_AND_ENTERTAINMENT",
    OTHER = "OTHER",
    OUTDOOR_MARKETS = "OUTDOOR_MARKETS",
    PERSONAL_SERVICES = "PERSONAL_SERVICES",
    POLITICAL_ORGANIZATIONS = "POLITICAL_ORGANIZATIONS",
    PROFESSIONAL_SERVICES = "PROFESSIONAL_SERVICES",
    REAL_ESTATE = "REAL_ESTATE",
    RECREATION_SERVICES = "RECREATION_SERVICES",
    REPAIR_SHOPS_AND_RELATED_SERVICES = "REPAIR_SHOPS_AND_RELATED_SERVICES",
    RESTAURANTS = "RESTAURANTS",
    RETAIL_SHOPS = "RETAIL_SHOPS",
    SCHOOLS_AND_EDUCATIONAL_SERVICES = "SCHOOLS_AND_EDUCATIONAL_SERVICES",
    SPORTING_GOODS = "SPORTING_GOODS",
    TAXICABS_AND_LIMOUSINES = "TAXICABS_AND_LIMOUSINES",
    TICKET_SALES = "TICKET_SALES",
    TOURISM = "TOURISM",
    TRAVEL_TOURISM = "TRAVEL_TOURISM",
    VETERINARY_SERVICES = "VETERINARY_SERVICES",
    WEB_DEV_DESIGN = "WEB_DEV_DESIGN",
}

export interface MerchantLocationDetails {
    nickname: string;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface GlobalAddress {
    address_line_1: string;
    address_line_2: string;
    address_line_3: string;
    address_line_4: string;
    address_line_5: string;
    locality: string;
    sublocality: string;
    sublocality_1: string;
    sublocality_2: string;
    sublocality_3: string;
    sublocality_4: string;
    sublocality_5: string;
    administrative_district_level_1: string;
    administrative_district_level_2: string;
    administrative_district_level_3: string;
    postal_code: string;
    country_code: string;
    address_coordinates: Coordinates;
}

export interface PhoneNumber {
    calling_code: string;
    number: string;
}

export interface Merchant {
    id: string;
    name: string;
    email: string;
    account_type: Merchant_AccountType;
    account_capabilities: Merchant_AccountCapability[];
    country_code: string;
    language_code: string;
    currency_code: string;
    business_name?: string;
    business_address?: GlobalAddress;
    business_phone?: PhoneNumber;
    business_type: Merchant_BusinessType;
    shipping_address?: GlobalAddress;
    location_details?: MerchantLocationDetails;
    market_url?: string;
}

export enum WebhookEventType {
    PAYMENT_UPDATED = "PAYMENT_UPDATED",
    INVENTORY_UPDATED = "INVENTORY_UPDATED",
    TIMECARD_UPDATED = "TIMECARD_UPDATED"
}

export interface WebhookNotification {
    merchant_id: string;
    location_id: string;
    event_type: WebhookEventType;
    entity_id: string;
}

export interface Device {
    name: string;
    id: string;
}

export enum Money_CurrencyCode {
    CAD = "CAD",
    JPY = "JPY",
    USD = "USD",
    AED = "AED",
    ALL = "ALL",
    AMD = "AMD",
    AOA = "AOA",
    ARS = "ARS",
    AUD = "AUD",
    AWG = "AWG",
    AZN = "AZN",
    BAM = "BAM",
    BBD = "BBD",
    BDT = "BDT",
    BGN = "BGN",
    BHD = "BHD",
    BMD = "BMD",
    BND = "BND",
    BOB = "BOB",
    BRL = "BRL",
    BSD = "BSD",
    BTN = "BTN",
    BWP = "BWP",
    BYR = "BYR",
    BZD = "BZD",
    CDF = "CDF",
    CHF = "CHF",
    CLP = "CLP",
    CNY = "CNY",
    COP = "COP",
    CRC = "CRC",
    CVE = "CVE",
    CZK = "CZK",
    DKK = "DKK",
    DOP = "DOP",
    DZD = "DZD",
    EGP = "EGP",
    ETB = "ETB",
    EUR = "EUR",
    FJD = "FJD",
    GBP = "GBP",
    GEL = "GEL",
    GHS = "GHS",
    GIP = "GIP",
    GMD = "GMD",
    GTQ = "GTQ",
    GYD = "GYD",
    HKD = "HKD",
    HNL = "HNL",
    HRK = "HRK",
    HTG = "HTG",
    HUF = "HUF",
    IDR = "IDR",
    ILS = "ILS",
    INR = "INR",
    ISK = "ISK",
    JMD = "JMD",
    JOD = "JOD",
    KES = "KES",
    KGS = "KGS",
    KHR = "KHR",
    KRW = "KRW",
    KWD = "KWD",
    KYD = "KYD",
    KZT = "KZT",
    LAK = "LAK",
    LBP = "LBP",
    LKR = "LKR",
    LRD = "LRD",
    LTL = "LTL",
    MAD = "MAD",
    MDL = "MDL",
    MGA = "MGA",
    MKD = "MKD",
    MMK = "MMK",
    MNT = "MNT",
    MOP = "MOP",
    MRO = "MRO",
    MUR = "MUR",
    MWK = "MWK",
    MXN = "MXN",
    MYR = "MYR",
    MZN = "MZN",
    NAD = "NAD",
    NGN = "NGN",
    NIO = "NIO",
    NOK = "NOK",
    NPR = "NPR",
    NZD = "NZD",
    OMR = "OMR",
    PAB = "PAB",
    PEN = "PEN",
    PGK = "PGK",
    PHP = "PHP",
    PKR = "PKR",
    PLN = "PLN",
    PYG = "PYG",
    QAR = "QAR",
    RON = "RON",
    RSD = "RSD",
    RUB = "RUB",
    RWF = "RWF",
    SAR = "SAR",
    SBD = "SBD",
    SCR = "SCR",
    SEK = "SEK",
    SGD = "SGD",
    SLL = "SLL",
    SRD = "SRD",
    STD = "STD",
    SVC = "SVC",
    SZL = "SZL",
    THB = "THB",
    TJS = "TJS",
    TMT = "TMT",
    TND = "TND",
    TRY = "TRY",
    TTD = "TTD",
    TWD = "TWD",
    TZS = "TZS",
    UAH = "UAH",
    UGX = "UGX",
    UYU = "UYU",
    UZS = "UZS",
    VEF = "VEF",
    VND = "VND",
    XAF = "XAF",
    XCD = "XCD",
    XOF = "XOF",
    YER = "YER",
    ZAR = "ZAR",
    ZMW = "ZMW"
}

export interface Money {
    amount: number;
    currency_code: Money_CurrencyCode;
}

export enum Fee_InclusionType {
    ADDITIVE = "ADDITIVE",
    INCLUSIVE = "INCLUSIVE"
}

export interface PaymentTax {
    name: string;
    applied_money: Money;
    rate: string;
    inclusion_type: Fee_InclusionType;
    fee_id: string;
}

export enum Tender_Type {
    CREDIT_CARD = "CREDIT_CARD",
    CASH = "CASH",
    THIRD_PARTY_CARD = "THIRD_PARTY_CARD",
    NO_SALE = "NO_SALE",
    SQUARE_WALLET = "SQUARE_WALLET",
    SQUARE_GIFT_CARD = "SQUARE_GIFT_CARD",
    UNKNOWN = "UNKNOWN",
    OTHER = "OTHER"
}

export enum Tender_CardBrand {
    OTHER_BRAND = "OTHER_BRAND",
    VISA = "VISA",
    MASTER_CARD = "MASTER_CARD",
    AMERICAN_EXPRESS = "AMERICAN_EXPRESS",
    DISCOVER = "DISCOVER",
    DISCOVER_DINERS = "DISCOVER_DINERS",
    JCB = "JCB",
    CHINA_UNIONPAY = "CHINA_UNIONPAY",
    SQUARE_GIFT_CARD = "SQUARE_GIFT_CARD"
}

export enum Tender_EntryMethod {
    MANUAL = "MANUAL",
    SCANNED = "SCANNED",
    SQUARE_CASH = "SQUARE_CASH",
    SQUARE_WALLET = "SQUARE_WALLET",
    SWIPED = "SWIPED",
    WEB_FORM = "WEB_FORM",
    OTHER = "OTHER"
}

export interface Tender {
    id: string;
    type: Tender_Type;
    name: string;
    employee_id: string;
    receipt_url: string;
    card_brand: Tender_CardBrand;
    pan_suffix: string;
    entry_method: Tender_EntryMethod;
    payment_note: string;
    is_exchange: boolean;
    total_money: Money;
    tendered_money: Money;
    tendered_at: string;
    settled_at: string;
    change_back_money: Money;
    refunded_money: Money;
}

export enum Refund_Type {
    FULL = "FULL",
    PARTIAL = "PARTIAL"
}

export interface Refund {
    type: Refund_Type;
    reason: string;
    refunded_money: Money;
    created_at: string;
    processed_at: string;
    payment_id: string;
    merchant_id: string;
    is_exchange: string;
}

export enum PaymentItemization_Type {
    ITEM = "ITEM",
    CUSTOM_AMOUNT = "CUSTOM_AMOUNT",
    GIFT_CARD_ACTIVATION = "GIFT_CARD_ACTIVATION",
    GIFT_CARD_RELOAD = "GIFT_CARD_RELOAD",
    GIFT_CARD_UNKNOWN = "GIFT_CARD_UNKNOWN",
    OTHER = "OTHER"
}

export interface PaymentItemDetail {
    category_name: string;
    sku: string;
    item_id: string;
    item_variation_id: string;
}

export interface PaymentDiscount {
    name: string;
    applied_money: Money;
    discount_id: string;
}

export interface PaymentModifier {
    name: string;
    applied_money: Money;
    modifier_option_id: string;
}

export interface PaymentItemization {
    name: string;
    quantity: number;
    itemization_type: PaymentItemization_Type;
    item_detail: PaymentItemDetail;
    notes?: string;
    item_variation_name: string;
    total_money: Money;
    single_quantity_money: Money;
    gross_sales_money: Money;
    discount_money: Money;
    net_sales_money: Money;
    taxes: PaymentTax[];
    discounts: PaymentDiscount[];
    modifiers: PaymentModifier[];
}

export enum Surcharge_Type {
    UNKNOWN = "UNKNOWN",
    AUTO_GRATUITY = "AUTO_GRATUITY",
    CUSTOM = "CUSTOM"
}

export interface PaymentSurcharge {
    name: string;
    applied_money: Money;
    rate: string;
    amount_money: Money;
    type: Surcharge_Type;
    taxable: boolean;
    taxes: PaymentTax[];
    surcharge_id: string;
}

export interface Payment {
    id: string;
    merchant_id: string;
    created_at: string;
    creator_id: string;
    device: Device;
    payment_url: string;
    receipt_url: string;
    inclusive_tax_money: Money;
    additive_tax_money: Money;
    tax_money: Money;
    tip_money: Money;
    discount_money: Money;
    total_collected_money: Money;
    processing_fee_money: Money;
    net_total_money: Money;
    refunded_money: Money;
    swedish_rounding_money: Money;
    gross_sales_money: Money;
    net_sales_money: Money;
    inclusive_tax: PaymentTax[];
    additive_tax: PaymentTax[];
    tender: Tender[];
    refunds: Refund[];
    itemizations: PaymentItemization[];
    surcharge_money: Money;
    surcharges: PaymentSurcharge[];
    is_partial: boolean;
}

export enum ErrorCategory {
    API_ERROR = "API_ERROR",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
    INVALID_REQUEST_ERROR = "INVALID_REQUEST_ERROR",
    RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
    PAYMENT_METHOD_ERROR = "PAYMENT_METHOD_ERROR",
    REFUND_ERROR = "REFUND_ERROR"
}

export enum ErrorCode {
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    UNAUTHORIZED = "UNAUTHORIZED",
    ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED",
    ACCESS_TOKEN_REVOKED = "ACCESS_TOKEN_REVOKED",
    FORBIDDEN = "FORBIDDEN",
    INSUFFICIENT_SCOPES = "INSUFFICIENT_SCOPES",
    APPLICATION_DISABLED = "APPLICATION_DISABLED",
    V1_APPLICATION = "V1_APPLICATION",
    V1_ACCESS_TOKEN = "V1_ACCESS_TOKEN",
    CARD_PROCESSING_NOT_ENABLED = "CARD_PROCESSING_NOT_ENABLED",
    BAD_REQUEST = "BAD_REQUEST",
    MISSING_REQUIRED_PARAMETER = "MISSING_REQUIRED_PARAMETER",
    INCORRECT_TYPE = "INCORRECT_TYPE",
    INVALID_TIME = "INVALID_TIME",
    INVALID_TIME_RANGE = "INVALID_TIME_RANGE",
    INVALID_VALUE = "INVALID_VALUE",
    INVALID_CURSOR = "INVALID_CURSOR",
    UNKNOWN_QUERY_PARAMETER = "UNKNOWN_QUERY_PARAMETER",
    CONFLICTING_PARAMETERS = "CONFLICTING_PARAMETERS",
    EXPECTED_JSON_BODY = "EXPECTED_JSON_BODY",
    INVALID_SORT_ORDER = "INVALID_SORT_ORDER",
    VALUE_REGEX_MISMATCH = "VALUE_REGEX_MISMATCH",
    VALUE_TOO_SHORT = "VALUE_TOO_SHORT",
    VALUE_TOO_LONG = "VALUE_TOO_LONG",
    VALUE_TOO_LOW = "VALUE_TOO_LOW",
    VALUE_TOO_HIGH = "VALUE_TOO_HIGH",
    VALUE_EMPTY = "VALUE_EMPTY",
    ARRAY_LENGTH_TOO_LONG = "ARRAY_LENGTH_TOO_LONG",
    ARRAY_LENGTH_TOO_SHORT = "ARRAY_LENGTH_TOO_SHORT",
    ARRAY_EMPTY = "ARRAY_EMPTY",
    EXPECTED_BOOLEAN = "EXPECTED_BOOLEAN",
    EXPECTED_INTEGER = "EXPECTED_INTEGER",
    EXPECTED_FLOAT = "EXPECTED_FLOAT",
    EXPECTED_STRING = "EXPECTED_STRING",
    EXPECTED_OBJECT = "EXPECTED_OBJECT",
    EXPECTED_ARRAY = "EXPECTED_ARRAY",
    EXPECTED_BASE64_ENCODED_BYTE_ARRAY = "EXPECTED_BASE64_ENCODED_BYTE_ARRAY",
    INVALID_ARRAY_VALUE = "INVALID_ARRAY_VALUE",
    INVALID_ENUM_VALUE = "INVALID_ENUM_VALUE",
    INVALID_CONTENT_TYPE = "INVALID_CONTENT_TYPE",
    INVALID_FORM_VALUE = "INVALID_FORM_VALUE",
    ONE_INSTRUMENT_EXPECTED = "ONE_INSTRUMENT_EXPECTED",
    NO_FIELDS_SET = "NO_FIELDS_SET",
    DEPRECATED_FIELD_SET = "DEPRECATED_FIELD_SET",
    CARD_EXPIRED = "CARD_EXPIRED",
    INVALID_EXPIRATION = "INVALID_EXPIRATION",
    INVALID_EXPIRATION_YEAR = "INVALID_EXPIRATION_YEAR",
    INVALID_EXPIRATION_DATE = "INVALID_EXPIRATION_DATE",
    UNSUPPORTED_CARD_BRAND = "UNSUPPORTED_CARD_BRAND",
    UNSUPPORTED_ENTRY_METHOD = "UNSUPPORTED_ENTRY_METHOD",
    INVALID_CARD = "INVALID_CARD",
    DELAYED_TRANSACTION_EXPIRED = "DELAYED_TRANSACTION_EXPIRED",
    DELAYED_TRANSACTION_CANCELED = "DELAYED_TRANSACTION_CANCELED",
    DELAYED_TRANSACTION_CAPTURED = "DELAYED_TRANSACTION_CAPTURED",
    DELAYED_TRANSACTION_FAILED = "DELAYED_TRANSACTION_FAILED",
    CARD_TOKEN_EXPIRED = "CARD_TOKEN_EXPIRED",
    CARD_TOKEN_USED = "CARD_TOKEN_USED",
    AMOUNT_TOO_HIGH = "AMOUNT_TOO_HIGH",
    UNSUPPORTED_INSTRUMENT_TYPE = "UNSUPPORTED_INSTRUMENT_TYPE",
    REFUND_AMOUNT_INVALID = "REFUND_AMOUNT_INVALID",
    REFUND_ALREADY_PENDING = "REFUND_ALREADY_PENDING",
    PAYMENT_NOT_REFUNDABLE = "PAYMENT_NOT_REFUNDABLE",
    INVALID_CARD_DATA = "INVALID_CARD_DATA",
    LOCATION_MISMATCH = "LOCATION_MISMATCH",
    IDEMPOTENCY_KEY_REUSED = "IDEMPOTENCY_KEY_REUSED",
    UNEXPECTED_VALUE = "UNEXPECTED_VALUE",
    SANDBOX_NOT_SUPPORTED = "SANDBOX_NOT_SUPPORTED",
    INVALID_EMAIL_ADDRESS = "INVALID_EMAIL_ADDRESS",
    INVALID_PHONE_NUMBER = "INVALID_PHONE_NUMBER",
    CHECKOUT_EXPIRED = "CHECKOUT_EXPIRED",
    BAD_CERTIFICATE = "BAD_CERTIFICATE",
    CARD_DECLINED = "CARD_DECLINED",
    VERIFY_CVV_FAILURE = "VERIFY_CVV_FAILURE",
    VERIFY_AVS_FAILURE = "VERIFY_AVS_FAILURE",
    CARD_DECLINED_CALL_ISSUER = "CARD_DECLINED_CALL_ISSUER",
    NOT_FOUND = "NOT_FOUND",
    APPLE_PAYMENT_PROCESSING_CERTIFICATE_HASH_NOT_FOUND = "APPLE_PAYMENT_PROCESSING_CERTIFICATE_HASH_NOT_FOUND",
    METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED",
    REQUEST_TIMEOUT = "REQUEST_TIMEOUT",
    CONFLICT = "CONFLICT",
    REQUEST_ENTITY_TOO_LARGE = "REQUEST_ENTITY_TOO_LARGE",
    UNSUPPORTED_MEDIA_TYPE = "UNSUPPORTED_MEDIA_TYPE",
    RATE_LIMITED = "RATE_LIMITED",
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
    GATEWAY_TIMEOUT = "GATEWAY_TIMEOUT"
}

export interface ApiError {
    category: ErrorCategory;
    code: ErrorCode;
    detail: string;
    field?: string;
}

export interface RenewTokenResponse {
    access_token: string;
    token_type: string;
    expires_at: string;
    merchant_id: string;
}

export function isErrorList(thing: any): thing is { errors: ApiError[] } {
    return "errors" in thing && Array.isArray(thing.errors) && thing.errors.every((e: any) => isError(e)); // tslint:disable-line
}
export function isError(thing: any): thing is ApiError {
    return "category" in thing && "code" in thing && "detail" in thing; // tslint:disable-line
}
