using AutoMapper;
using System.Globalization;
using Sleep.Communication.Requests;
using Sleep.Domain.Entities;

namespace Sleep.Application.Services.AutoMapper
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            RequestToDomain();
        }
        public void RequestToDomain()
        {
            CreateMap<RequestRegisterUserJson, User>()
                .ForMember(dest => dest.Password, opt => opt.Ignore());
        }
    }
}
