import Modal from "../../../components/Modal";
import Avatar from "../../../components/Avatar";
import Badge from "../../../components/Badge";
import AppIcon from "../../../components/AppIcon";
import { formatDate } from "../../../utils/format";

const AdminUserDetailModal = ({ open, onClose, selectedUser }) => {
  return (
    <Modal open={open} onClose={onClose} title="Detail Pengguna">
      {selectedUser && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={selectedUser.name} size={56} colorIndex={selectedUser.id} />
            <div>
              <div className="font-bold text-base">{selectedUser.name}</div>
              <div className="text-sm text-gray-400">{selectedUser.email}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              ["Telepon", selectedUser.phone || "-", "phone"],
              ["Alamat", selectedUser.address || "-", "mapPin"],
              ["Bergabung", selectedUser.createdAt ? formatDate(selectedUser.createdAt) : "-", "calendar"],
              ["Role", selectedUser.role, "user"],
            ].map(([key, value, icon]) => (
              <div key={key} className="flex gap-2">
                <span className="text-sm font-semibold text-gray-400 min-w-[90px] inline-flex items-center gap-1">
                  <AppIcon name={icon} size={12} /> {key}
                </span>
                <span className="text-sm capitalize">{value}</span>
              </div>
            ))}
          </div>
          {selectedUser.role === "penyedia" && (
            <div>
              <div className="text-sm font-semibold text-gray-400 mb-2 inline-flex items-center gap-1">
                <AppIcon name="wrench" size={13} /> Keahlian
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.skills?.map((skill) => (
                  <Badge key={skill} color="#0284C7">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {selectedUser.role === "penyedia" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="font-bold text-xl text-yellow-500 inline-flex items-center gap-1">
                  <AppIcon name="star" size={16} /> {selectedUser.rating}
                </div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="font-bold text-xl text-blue-500">{selectedUser.totalJobs}</div>
                <div className="text-xs text-gray-400">Total Pekerjaan</div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AdminUserDetailModal;
