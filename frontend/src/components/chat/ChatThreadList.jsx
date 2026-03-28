import TopBar from "../../layouts/TopBar";
import Card from "../Card";
import Avatar from "../Avatar";
import AppIcon from "../AppIcon";
import { formatTime } from "../../utils/format";

const ChatThreadList = ({ threads, getMessages, onSelectThread }) => {
  return (
    <div className="pb-20 min-h-screen">
      <TopBar title="Pesan" subtitle={`${threads.length} chat transaksi aktif`} />

      <div className="px-5 pt-4">
        {threads.length === 0 && (
          <Card className="px-5 py-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
              <AppIcon name="message" size={22} />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">Belum ada chat aktif</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Chat hanya aktif untuk transaksi berstatus menunggu atau berlangsung. Saat transaksi selesai, riwayat chat akan direset.
            </p>
          </Card>
        )}

        {threads.map((thread) => {
          const messages = getMessages(thread.order.id);
          const lastMessage = messages[messages.length - 1];

          return (
            <Card
              key={thread.order.id}
              onClick={() => onSelectThread(thread)}
              className="mb-3 py-3.5 px-4 border-slate-200/80 hover:border-sky-200"
            >
              <div className="flex gap-3 items-center">
                <Avatar name={thread.contact.name} size={48} colorIndex={thread.contact.id} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-slate-800 truncate">{thread.contact.name}</span>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {lastMessage ? formatTime(lastMessage.createdAt) : "Baru"}
                    </span>
                  </div>

                  <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-sky-700 bg-sky-50 px-2 py-1 rounded-full max-w-full">
                    <AppIcon name="briefcase" size={11} />
                    <span className="truncate">Order: {thread.order.service}</span>
                  </div>

                  <p className="text-sm text-slate-500 mt-1.5 truncate">
                    {lastMessage ? lastMessage.message : "Belum ada pesan untuk transaksi ini"}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ChatThreadList;
