import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage')));
const Category = Loadable(lazy(() => import('views/Category')));
const CategoryForm = Loadable(lazy(() => import('views/Category/CategoryForm')));
const SubCategory = Loadable(lazy(() => import('views/SubCategory')));
const Brands = Loadable(lazy(() => import('views/Brands')));
const VariantType = Loadable(lazy(() => import('views/VariantType')));
const VariantTypeForm = Loadable(lazy(() => import('views/VariantType/VariantTypeForm')));
const Variant = Loadable(lazy(() => import('views/Variant')));
const VariantForm = Loadable(lazy(() => import('views/Variant/VariantForm')));
const Order = Loadable(lazy(() => import('views/Order')));
const OrdersForm = Loadable(lazy(() => import('views/Order/OrdersForm')));
const OrderDetailsDialog = Loadable(lazy(() => import('views/Order/OrderDetailsDialog')));

const Coupons = Loadable(lazy(() => import('views/Coupons')));
const CouponsForm = Loadable(lazy(() => import('views/Coupons/CouponsForm')));
const Posters = Loadable(lazy(() => import('views/Posters')));
const Notifications = Loadable(lazy(() => import('views/Notifications')));
const NotificationsForm = Loadable(lazy(() => import('views/Notifications/NotificationsForm')));
const ProductForm = Loadable(lazy(() => import('views/Dashboard/product/ProductForm')));
const BrandForm = Loadable(lazy(() => import('views/Brands/BrandForm')));
const Settings = Loadable(lazy(() => import('views/Settings')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard/default',
      element: <DashboardDefault />
    },
    { path: '/utils/util-typography', element: <UtilsTypography /> },
    { path: '/sample-page', element: <SamplePage /> },
    { path: '/Category', element: <Category /> },
    { path: '/CategoryForm', element: <CategoryForm /> },
    { path: '/SubCategory', element: <SubCategory /> },
    { path: '/Brands', element: <Brands /> },
    { path: 'BrandForm', element: <BrandForm /> },
    { path: '/VariantType', element: <VariantType /> },
    { path: '/VariantTypeForm', element: <VariantTypeForm /> },
    { path: '/Variant', element: <Variant /> },
    { path: '/VariantForm', element: <VariantForm /> },
    { path: '/Order', element: <Order /> },
    { path: '/OrdersForm', element: <OrdersForm /> },
    { path: '/OrderDetailsDialog', element: <OrderDetailsDialog /> },

    { path: 'Coupons', element: <Coupons /> },
    { path: 'CouponsForm', element: <CouponsForm /> },
    { path: 'Posters', element: <Posters /> },
    { path: 'Notifications', element: <Notifications /> },
    { path: 'NotificationsForm', element: <NotificationsForm /> },
    { path: 'ProductForm', element: <ProductForm /> },
    { path: '/application/settings', element: <Settings /> }
  ]
};

export default MainRoutes;
