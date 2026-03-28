import Card from "../../../components/Card";
import Button from "../../../components/Button";

const AvailabilityTab = ({
  myAvailability,
  editScheduleMode,
  editedSchedule,
  setEditedSchedule,
  setEditScheduleMode,
  onSaveSchedule,
}) => {
  if (!myAvailability) {
    return (
      <>
        <h3 className="font-bold text-lg mb-4">Jadwal Ketersediaan</h3>
        <Card className="p-4 text-center text-gray-500">
          <p>Jadwal ketersediaan belum dikonfigurasi.</p>
        </Card>
      </>
    );
  }

  return (
    <>
      <h3 className="font-bold text-lg mb-4">Jadwal Ketersediaan</h3>

      {!editScheduleMode ? (
        <>
          <div className="space-y-2">
            {Object.entries(myAvailability.schedule).map(([day, times]) => (
              <Card key={day} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${times.available ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="capitalize font-semibold text-sm text-gray-800" style={{ minWidth: "80px" }}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {times.available ? `${times.startTime} - ${times.endTime}` : "Libur"}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <Button
            size="sm"
            className="mt-4 w-full"
            variant="outline"
            onClick={() => {
              setEditedSchedule(JSON.parse(JSON.stringify(myAvailability.schedule)));
              setEditScheduleMode(true);
            }}
          >
            Edit Jadwal
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-3">
            {Object.entries(editedSchedule || {}).map(([day, times]) => (
              <Card key={day} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="capitalize font-semibold text-sm text-gray-800">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={times.available}
                        onChange={(e) => {
                          setEditedSchedule((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], available: e.target.checked },
                          }));
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-600">Tersedia</span>
                    </label>
                  </div>
                  {times.available && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Jam Mulai</label>
                        <input
                          type="time"
                          value={times.startTime}
                          onChange={(e) => {
                            setEditedSchedule((prev) => ({
                              ...prev,
                              [day]: { ...prev[day], startTime: e.target.value },
                            }));
                          }}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Jam Selesai</label>
                        <input
                          type="time"
                          value={times.endTime}
                          onChange={(e) => {
                            setEditedSchedule((prev) => ({
                              ...prev,
                              [day]: { ...prev[day], endTime: e.target.value },
                            }));
                          }}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Button size="sm" className="flex-1" onClick={onSaveSchedule}>
              Simpan
            </Button>
            <Button
              size="sm"
              className="flex-1"
              variant="outline"
              onClick={() => {
                setEditScheduleMode(false);
                setEditedSchedule(null);
              }}
            >
              Batal
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default AvailabilityTab;
