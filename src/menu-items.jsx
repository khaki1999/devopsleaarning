// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  CategoryOutlinedIcon: CategoryOutlinedIcon,
  SubdirectoryArrowRightOutlinedIcon: SubdirectoryArrowRightOutlinedIcon,
  SellOutlinedIcon: SellOutlinedIcon,
  StyleOutlinedIcon: StyleOutlinedIcon,
  ShoppingCartOutlinedIcon: ShoppingCartOutlinedIcon,
  LocalOfferOutlinedIcon: LocalOfferOutlinedIcon,
  ImageOutlinedIcon: ImageOutlinedIcon,
  NotificationsOutlinedIcon: NotificationsOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon
};

// ==============================|| MENU ITEMS ||============================== //

export default {
  items: [
    {
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard/default'
        }
      ]
    },
    {
      id: 'pages',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'category',
          title: 'Category',
          type: 'item',
          url: '/Category',
          icon: icons['CategoryOutlinedIcon']
        },
        {
          id: 'SubCategory',
          title: 'Sub Category',
          type: 'item',
          url: '/SubCategory',
          icon: icons['SubdirectoryArrowRightOutlinedIcon']
        },
        {
          id: 'Brands',
          title: 'Brands',
          type: 'item',
          url: '/Brands',
          icon: icons['SellOutlinedIcon']
        },
        {
          id: 'VariantType',
          title: 'Variant Type',
          type: 'item',
          url: '/VariantType',
          icon: icons['StyleOutlinedIcon']
        },
        {
          id: 'Variant',
          title: 'Variant',
          type: 'item',
          url: '/Variant',
          icon: icons['StyleOutlinedIcon']
        },
        {
          id: 'Order',
          title: 'Orders',
          type: 'item',
          url: '/Order',
          icon: icons['ShoppingCartOutlinedIcon']
        },
        {
          id: 'Coupons',
          title: 'Coupons',
          type: 'item',
          url: '/Coupons',
          icon: icons['LocalOfferOutlinedIcon']
        },
        {
          id: 'Posters',
          title: 'Posters',
          type: 'item',
          url: '/Posters',
          icon: icons['ImageOutlinedIcon']
        },
        {
          id: 'Notifications',
          title: 'Notifications',
          type: 'item',
          url: '/Notifications',
          icon: icons['NotificationsOutlinedIcon']
        }
      ]
    }
  ]
};
