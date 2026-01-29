using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Online_LMS.DTOs;
using OpenAI.Chat;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("openai")]
    public class OpenAiController : ControllerBase
    {
        private readonly IConfiguration _config;

        public OpenAiController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("improve-topic")]
        public async Task<IActionResult> ImproveTopic([FromBody] ImproveTopicDto dto)
        {
            var apiKey = _config["OpenAI:ApiKey"];

            if (string.IsNullOrEmpty(apiKey))
                return BadRequest("OpenAI API key missing");

            var client = new ChatClient("gpt-4o-mini", apiKey);

            var prompt = $@"
            Improve this LMS topic.
            Return JSON ONLY in this format:

            {{
            ""topicName"": ""Improved name"",
            ""topicDescription"": ""Improved description""
            }}

            Topic Name: {dto.TopicName}
            Description: {dto.TopicDescription}
            ";

            var response = await client.CompleteChatAsync(prompt);

            return Ok(new
            {
                improved = response.Value.Content[0].Text
            });
        }
    }
}
