using Sleep.Domain.Entities;

namespace Sleep.Domain.Repositories.SleepRecord
{
    public interface ISleepRecordRepositoryWriteOnly
    {
        public Task Add(Entities.SleepRecord record);
    }
}
