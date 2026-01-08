package com.company.platform.reports;

import java.util.List;
import java.util.stream.Collectors;

public class CsvUtil {

    public static String toCsv(List<String[]> rows) {
        return rows.stream()
                .map(row -> String.join(",", row))
                .collect(Collectors.joining("\n"));
    }
}
