import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import AppIcon from "../../../components/AppIcon";
import { formatRupiah, formatDate } from "../../../utils/format";

const AdminOrderCard = ({ order, customer, provider, statusColors, onOpenDetail }) => {
  return (
    <Card className="mb-3" onClick={() => onOpenDetail(order)}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0 mr-2">
          <div className="font-bold text-sm truncate">{order.service}</div>
          <div className="text-[11px] text-gray-400 mt-0.5 inline-flex items-center gap-1">
            <AppIcon name="user" size={11} /> {customer?.name} {"->"} <AppIcon name="hardHat" size={11} /> {provider?.name}
          </div>
        </div>
        <Badge color={statusColors[order.status] || "#94A3B8"}>{order.status}</Badge>
      </div>
      <div className="text-xs text-gray-400 mb-1 inline-flex items-center gap-1">
        <AppIcon name="mapPin" size={12} /> {order.location}
      </div>
      <div className="flex items-center justify-between mt-2">
        {order.price > 0 ? <span className="text-sm font-semibold text-sky-600">{formatRupiah(order.price)}</span> : <span />}
        <span className="text-[11px] text-gray-400 inline-flex items-center gap-1">
          <AppIcon name="calendar" size={11} /> {formatDate(order.createdAt, { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>
    </Card>
  );
};

export default AdminOrderCard;
