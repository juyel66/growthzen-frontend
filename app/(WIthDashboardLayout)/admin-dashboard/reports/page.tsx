"use client";

import React, { useState } from "react";
import { ReportDateRange, ReportQueryParams } from "@/types/report";
import {
  useGetSalesReportQuery,
  useGetRevenueReportQuery,
  useGetOrderReportQuery,
  useGetProductReportQuery,
  useGetCustomerReportQuery,
  useGetPaymentReportQuery,
  useGetCouponReportQuery,
} from "@/services/reportApi";

import { ReportHeader } from "@/components/admin/reports/ReportHeader";
import { ReportTabs, ReportTabType } from "@/components/admin/reports/ReportTabs";
import { ReportFilters } from "@/components/admin/reports/ReportFilters";
import { SalesReportView } from "@/components/admin/reports/SalesReportView";
import { RevenueReportView } from "@/components/admin/reports/RevenueReportView";
import { OrdersReportView } from "@/components/admin/reports/OrdersReportView";
import { ProductsReportView } from "@/components/admin/reports/ProductsReportView";
import { CustomersReportView } from "@/components/admin/reports/CustomersReportView";
import { PaymentsReportView } from "@/components/admin/reports/PaymentsReportView";
import { CouponsReportView } from "@/components/admin/reports/CouponsReportView";
import {
  ReportCardsSkeleton,
  ReportChartSkeleton,
  ReportTableSkeleton,
} from "@/components/admin/reports/ReportSkeletons";
import { ReportErrorState } from "@/components/admin/reports/ReportStates";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTabType>("sales");
  const [range, setRange] = useState<ReportDateRange>("LAST_30_DAYS");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [queryParams, setQueryParams] = useState<ReportQueryParams>({
    range: "LAST_30_DAYS",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Synchronize range changes with queryParams
  const handleRangeChange = (newRange: ReportDateRange) => {
    setRange(newRange);
    setQueryParams((prev) => ({
      ...prev,
      range: newRange,
      from: newRange === "CUSTOM" ? fromDate : undefined,
      to: newRange === "CUSTOM" ? toDate : undefined,
      page: 1,
    }));
  };

  const handleApplyCustomRange = () => {
    setQueryParams((prev) => ({
      ...prev,
      range: "CUSTOM",
      from: fromDate,
      to: toDate,
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setQueryParams({
      range,
      from: range === "CUSTOM" ? fromDate : undefined,
      to: range === "CUSTOM" ? toDate : undefined,
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
      search: undefined,
      status: undefined,
      paymentMethod: undefined,
    });
  };

  // Lazy execution via skip option
  const salesQuery = useGetSalesReportQuery(queryParams, { skip: activeTab !== "sales" });
  const revenueQuery = useGetRevenueReportQuery(queryParams, { skip: activeTab !== "revenue" });
  const ordersQuery = useGetOrderReportQuery(queryParams, { skip: activeTab !== "orders" });
  const productsQuery = useGetProductReportQuery(queryParams, { skip: activeTab !== "products" });
  const customersQuery = useGetCustomerReportQuery(queryParams, { skip: activeTab !== "customers" });
  const paymentsQuery = useGetPaymentReportQuery(queryParams, { skip: activeTab !== "payments" });
  const couponsQuery = useGetCouponReportQuery(queryParams, { skip: activeTab !== "coupons" });

  const getCurrentQuery = () => {
    switch (activeTab) {
      case "sales":
        return salesQuery;
      case "revenue":
        return revenueQuery;
      case "orders":
        return ordersQuery;
      case "products":
        return productsQuery;
      case "customers":
        return customersQuery;
      case "payments":
        return paymentsQuery;
      case "coupons":
        return couponsQuery;
    }
  };

  const currentQuery = getCurrentQuery();
  const { isLoading, isFetching, isError, error, refetch } = currentQuery;

  const renderActiveReportView = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <ReportCardsSkeleton />
          <ReportChartSkeleton />
          <ReportTableSkeleton />
        </div>
      );
    }

    if (isError) {
      return (
        <ReportErrorState
          message={(error as any)?.data?.message || "Failed to load report data."}
          onRetry={() => refetch()}
        />
      );
    }

    switch (activeTab) {
      case "sales":
        return (
          <SalesReportView
            data={salesQuery.data?.data}
            meta={salesQuery.data?.meta}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        );
      case "revenue":
        return (
          <RevenueReportView
            data={revenueQuery.data?.data}
            meta={revenueQuery.data?.meta}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        );
      case "orders":
        return (
          <OrdersReportView
            data={ordersQuery.data?.data}
            meta={ordersQuery.data?.meta}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        );
      case "products":
        return (
          <ProductsReportView
            data={productsQuery.data?.data}
            meta={productsQuery.data?.meta}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        );
      case "customers":
        return (
          <CustomersReportView
            data={customersQuery.data?.data}
            meta={customersQuery.data?.meta}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        );
      case "payments":
        return (
          <PaymentsReportView
            data={paymentsQuery.data?.data}
            meta={paymentsQuery.data?.meta}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        );
      case "coupons":
        return (
          <CouponsReportView
            data={couponsQuery.data?.data}
            meta={couponsQuery.data?.meta}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <ReportHeader
        range={range}
        setRange={handleRangeChange}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onRefresh={() => refetch()}
        isFetching={isFetching}
        onApplyCustomRange={handleApplyCustomRange}
      />

      {/* Module Tabs Navigation */}
      <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dynamic Filters Bar */}
      <ReportFilters
        activeTab={activeTab}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        onReset={handleResetFilters}
      />

      {/* Report Module Body */}
      <div className="relative min-h-[400px]">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[1px] z-10 flex items-start justify-center pt-20">
            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Updating Report Data...
            </div>
          </div>
        )}
        {renderActiveReportView()}
      </div>
    </div>
  );
}
