import { Box, CircularProgress, Tab, Tabs } from "@mui/material";
import { Suspense, lazy, memo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BackHistorybtn } from "../../components/layouts/layouts";

const PendingOrders = lazy(() =>
  import("../../components/AppContent/orderStatus/PendingOrders")
);
const DeliveredOrders = lazy(() =>
  import("../../components/AppContent/orderStatus/DeliveredOrders")
);
const CancleOrders = lazy(() =>
  import("../../components/AppContent/orderStatus/CancleOrders")
);

const tabs = [
  {
    label: "Pending",
    value: "pending-orders",
    component: <PendingOrders />,
  },
  {
    label: "Delivered",
    value: "delivered-orders",
    component: <DeliveredOrders />,
  },
  {
    label: "Cancelled",
    value: "cancelled-orders",
    component: <CancleOrders />,
  },
];

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  //  Ensure valid section
  let section = searchParams.get("section");
  useEffect(() => {
    if (!section || !tabs.some((tab) => tab.value === section)) {
      setSearchParams({ section: "pending-orders"},{replace: true});
    }
  },[section, setSearchParams]);

  const handleChange = (event, newValue) => {
    if (newValue === section) return; // Prevent unnecessary re-navigation
    setSearchParams({ section: newValue });
  };

  const selectedTab = tabs.find((tab) => tab.value === section);

  if(!section || !selectedTab) return null;

  return (
    <>
    
      <Tabs
        value={section}
        onChange={handleChange}
        sx={{
          mb: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          margin: 1,
          marginTop: 0,
          paddingTop: 6,
          position: "fixed",
          width: "95%",
          zIndex: 9,
          top: 0,
          boxShadow: 1,
        }}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
      >
       
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
        
      </Tabs>
      

      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          minHeight: "100vh",
          marginTop: 10,
          boxSizing: "border-box",
          display: "flex",
          gap: 2,
          backgroundColor: "white",
          flexDirection: "column",
        }}
      >
  
        <Suspense
          fallback={
            <CircularProgress
              size={60}
              sx={{ marginLeft: "auto", marginRight: "auto", color: "#0c4a6e" }}
            />
          }
        >
          {selectedTab?.component}
         
        </Suspense>
      </Box>
    </>
  );
};

export default memo(OrdersPage);
