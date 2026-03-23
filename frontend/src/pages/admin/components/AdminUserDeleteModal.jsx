import Modal from "../../../components/Modal";
import Button from "../../../components/Button";

const AdminUserDeleteModal = ({ open, onClose, selectedUser, onConfirmDelete }) => {
  return (
    <Modal open={open} onClose={onClose} title="Hapus Pengguna">
      <p className="text-gray-400 mb-5">
        Apakah Anda yakin ingin menghapus akun <strong>{selectedUser?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
      </p>
      <div className="flex gap-2.5">
        <Button fullWidth variant="danger" onClick={onConfirmDelete}>
          Ya, Hapus
        </Button>
        <Button fullWidth variant="outline" onClick={onClose}>
          Batal
        </Button>
      </div>
    </Modal>
  );
};

export default AdminUserDeleteModal;
