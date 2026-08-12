// ============================================================
// FONT AWESOME COMPAT LAYER
// Exposes Font Awesome free-solid icons with the same component
// names the app previously imported from "lucide-react", so call
// sites keep working without rewriting every <Icon className=...>.
// ============================================================
import * as solid from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

function make(def) {
  if (!def || !def.icon) {
    throw new Error("[fa] Missing Font Awesome icon definition");
  }
  const [viewWidth, viewHeight] = def.icon;
  const paths = def.icon[4];
  const pathData = Array.isArray(paths) ? paths : [paths];

  return function FaIcon({ className, size, style, color, fill, ariaHidden, ...rest }) {
    const mergedStyle = style ? { ...style } : {};
    if (typeof size === "number") {
      mergedStyle.width = size;
      mergedStyle.height = size;
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className={className}
        style={mergedStyle}
        fill={fill !== undefined ? fill : color || "currentColor"}
        aria-hidden={ariaHidden !== undefined ? ariaHidden : true}
        focusable="false"
        {...rest}
      >
        {pathData.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  };
}

export const Activity = make(solid.faHeartPulse);
export const AlertTriangle = make(solid.faTriangleExclamation);
export const AppleWhole = make(solid.faAppleWhole);
export const Archive = make(solid.faBoxArchive);
export const ArrowRight = make(solid.faArrowRight);
export const ArrowUpRight = make(solid.faArrowUpRightFromSquare);
export const Award = make(solid.faAward);
export const BadgeCheck = make(solid.faCircleCheck);
export const Ban = make(solid.faBan);
export const BarChart3 = make(solid.faChartBar);
export const Bell = make(solid.faBell);
export const Bookmark = make(solid.faBookmark);
export const BowlRice = make(solid.faBowlRice);
export const Building2 = make(solid.faBuilding);
export const Calendar = make(solid.faCalendarDays);
export const Camera = make(solid.faCamera);
export const CheckCheck = make(solid.faCheckDouble);
export const CheckCircle2 = make(solid.faCircleCheck);
export const ChevronDown = make(solid.faChevronDown);
export const ChevronLeft = make(solid.faChevronLeft);
export const ChevronRight = make(solid.faChevronRight);
export const CircleDollarSign = make(solid.faSackDollar);
export const CircleHelp = make(solid.faCircleQuestion);
export const ClipboardList = make(solid.faClipboardList);
export const Clock = make(solid.faClock);
export const Copy = make(solid.faCopy);
export const CreditCard = make(solid.faCreditCard);
export const Database = make(solid.faDatabase);
export const DollarSign = make(solid.faDollarSign);
export const Download = make(solid.faDownload);
export const Eye = make(solid.faEye);
export const EyeOff = make(solid.faEyeSlash);
export const FileDown = make(solid.faFileArrowDown);
export const FileSpreadsheet = make(solid.faFileExcel);
export const FileText = make(solid.faFileLines);
export const Flag = make(solid.faFlag);
export const Globe = make(solid.faGlobe);
export const HandCoins = make(solid.faHandHoldingDollar);
export const Handshake = make(solid.faHandshake);
export const Heart = make(solid.faHeart);
export const HelpCircle = make(solid.faCircleQuestion);
export const Home = make(solid.faHouse);
export const Info = make(solid.faInfo);
export const Key = make(solid.faKey);
export const Landmark = make(solid.faLandmark);
export const Laptop = make(solid.faLaptop);
export const LayoutDashboard = make(solid.faTableColumns);
export const LayoutGrid = make(solid.faThLarge);
export const Leaf = make(solid.faLeaf);
export const List = make(solid.faList);
export const ListChecks = make(solid.faListCheck);
export const Lock = make(solid.faLock);
export const LogOut = make(solid.faArrowRightFromBracket);
export const Mail = make(solid.faEnvelope);
export const MapPin = make(solid.faLocationDot);
export const Menu = make(solid.faBars);
export const MessageCircle = make(solid.faComment);
export const MessageSquare = make(solid.faMessage);
export const Minus = make(solid.faMinus);
export const Monitor = make(solid.faDesktop);
export const Mound = make(solid.faMound);
export const MoreHorizontal = make(solid.faEllipsis);
export const Package = make(solid.faBox);
export const PackageCheck = make(solid.faBoxOpen);
export const PackageSearch = make(solid.faBoxesStacked);
export const Paperclip = make(solid.faPaperclip);
export const Pencil = make(solid.faPencil);
export const Percent = make(solid.faPercent);
export const Phone = make(solid.faPhone);
export const Plus = make(solid.faPlus);
export const PlusCircle = make(solid.faCirclePlus);
export const Quote = make(solid.faQuoteLeft);
export const Receipt = make(solid.faReceipt);
export const RefreshCw = make(solid.faRotate);
export const Repeat = make(solid.faRepeat);
export const Rocket = make(solid.faRocket);
export const Save = make(solid.faFloppyDisk);
export const Search = make(solid.faMagnifyingGlass);
export const SearchX = make(solid.faMagnifyingGlassMinus);
export const Seedling = make(solid.faSeedling);
export const Send = make(solid.faPaperPlane);
export const Settings = make(solid.faGear);
export const Share2 = make(solid.faShareNodes);
export const ShieldCheck = make(solid.faShieldHalved);
export const ShoppingBag = make(solid.faBagShopping);
export const ShoppingCart = make(solid.faCartShopping);
export const SlidersHorizontal = make(solid.faSliders);
export const Smartphone = make(solid.faMobileScreen);
export const Sparkles = make(solid.faWandMagicSparkles);
export const Star = make(solid.faStar);
export const FaStar = make(solid.faStar);
export const FaStarOutline = make(faStarRegular);
export const Store = make(solid.faStore);
export const Tag = make(solid.faTag);
export const Target = make(solid.faBullseye);
export const Tractor = make(solid.faTractor);
export const Trash2 = make(solid.faTrash);
export const TrendingDown = make(solid.faArrowTrendDown);
export const TrendingUp = make(solid.faArrowTrendUp);
export const Truck = make(solid.faTruck);
export const Upload = make(solid.faUpload);
export const UploadCloud = make(solid.faCloudArrowUp);
export const User = make(solid.faUser);
export const UserCheck = make(solid.faUserCheck);
export const UserPlus = make(solid.faUserPlus);
export const UserRound = make(solid.faUser);
export const UserX = make(solid.faUserSlash);
export const Users = make(solid.faUsers);
export const Wallet = make(solid.faWallet);
export const Wheat = make(solid.faWheatAwn);
export const X = make(solid.faXmark);
export const XCircle = make(solid.faCircleXmark);
