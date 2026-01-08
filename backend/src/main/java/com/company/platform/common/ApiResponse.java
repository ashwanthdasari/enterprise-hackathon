package com.company.platform.common;



public record ApiResponse<T>(String code, T data) {}

