public record LoginRequest(string Username, string Password);
public record RegisterRequest(string Username, string Email, string Password);
public record UserDataResponse(string Username, string Email);