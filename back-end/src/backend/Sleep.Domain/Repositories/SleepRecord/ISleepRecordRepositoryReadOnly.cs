using Sleep.Domain.Dtos;
using Sleep.Domain.Utils.Page;

namespace Sleep.Domain.Repositories.SleepRecord
{
    public interface ISleepRecordRepositoryReadOnly
    {
        public Task<bool> ExistWithRecordDateAndUserId(DateOnly recordDate, long userId);
        public Task<PagedList<Entities.SleepRecord>> ListSleepRecordsAsync(long userId, PageParameters pageParameters,SleepHistoryFilterDto filterDto);
    }
}
