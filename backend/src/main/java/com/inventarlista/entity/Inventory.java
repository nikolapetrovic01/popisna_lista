package com.inventarlista.entity;

import java.time.LocalDate;

public class Inventory {
    private int id, status;
    private LocalDate startDate;
    private LocalDate endDate;

    public Inventory(int id, int status, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.status = status; // 1 being active and 0 being inactive
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
