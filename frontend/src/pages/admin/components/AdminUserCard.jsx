import Card from "../../../components/Card";
import Avatar from "../../../components/Avatar";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import AppIcon from "../../../components/AppIcon";

const AdminUserCard = ({ user, onOpenDetail, onVerify, onUnverify, onDelete }) => {
  return (
    <Card className="mb-3">
      <div className="flex gap-3 items-center">
        <Avatar name={user.name} size={48} colorIndex={user.id} />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm">{user.name}</div>
          <div className="text-xs text-gray-400">{user.email}</div>
          {user.role === "penyedia" && (
            <div className="mt-1">
              {user.isVerified ? (
                <Badge color="#22C55E">
                  <span className="inline-flex items-center gap-1">
                    <AppIcon name="badgeCheck" size={12} /> Terverifikasi
                  </span>
                </Badge>
              ) : (
                <Badge color="#F59E0B">
                  <span className="inline-flex items-center gap-1">
                    <AppIcon name="clock" size={12} /> Belum Diverifikasi
                  </span>
                </Badge>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => onOpenDetail(user)}
          className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-gray-700"
        >
          <AppIcon name="more" size={18} />
        </button>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
        {user.role === "penyedia" && !user.isVerified && (
          <Button size="sm" variant="success" onClick={() => onVerify(user)} icon={<AppIcon name="badgeCheck" size={14} />}>
            Verifikasi
          </Button>
        )}
        {user.role === "penyedia" && user.isVerified && (
          <Button size="sm" variant="ghost" onClick={() => onUnverify(user)}>
            Cabut Verifikasi
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => onOpenDetail(user)}>
          Detail
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(user)} icon={<AppIcon name="trash" size={14} />} />
      </div>
    </Card>
  );
};

export default AdminUserCard;
