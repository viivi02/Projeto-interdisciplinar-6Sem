using Microsoft.AspNetCore.Mvc;
using Sleep.Application.UseCases.User.Register;
using Sleep.Communication.Requests.User;
using Sleep.Communication.Responses;

namespace Sleep.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseUserRegister), StatusCodes.Status201Created)]
        public async Task<IActionResult> Register(
            [FromServices]IRegisterUserUseCase useCase,
            [FromBody]RequestRegisterUserJson requestBody
            )
        {
           var result = await useCase.Execute(requestBody);

           return Created(string.Empty, result);
        }
    }
}
