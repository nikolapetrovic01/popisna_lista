package com.inventarlista.entity;

import java.math.BigDecimal;

public class Item {
    private int id, userThatPutTheAmountIn, inventoryId;
    private String name, measurement, barcode;
    private BigDecimal presentAmount, inputtedAmount;

    public Item(int id, String name, String measurement, BigDecimal presentAmount, String barcode, BigDecimal inputtedAmount, int userThatPutTheAmountIn, int inventoryId) {
        this.id = id;
        this.presentAmount = presentAmount;
        this.inputtedAmount = inputtedAmount;
        this.userThatPutTheAmountIn = userThatPutTheAmountIn;
        this.inventoryId = inventoryId;
        this.name = name;
        this.measurement = measurement;
        this.barcode = barcode;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BigDecimal getPresentAmount() {
        return presentAmount;
    }

    public void setPresentAmount(BigDecimal presentAmount) {
        this.presentAmount = presentAmount;
    }

    public BigDecimal getInputtedAmount() {
        return inputtedAmount;
    }

    public void setInputtedAmount(BigDecimal inputtedAmount) {
        this.inputtedAmount = inputtedAmount;
    }

    public int getUserThatPutTheAmountIn() {
        return userThatPutTheAmountIn;
    }

    public void setUserThatPutTheAmountIn(int userThatPutTheAmountIn) {
        this.userThatPutTheAmountIn = userThatPutTheAmountIn;
    }

    public int getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(int inventoryId) {
        this.inventoryId = inventoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMeasurement() {
        return measurement;
    }

    public void setMeasurement(String measurement) {
        this.measurement = measurement;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }
}