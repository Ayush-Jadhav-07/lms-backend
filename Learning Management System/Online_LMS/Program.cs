using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Online_LMS.Data;
using Online_LMS.Services;
using System.Text;

namespace Online_LMS
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = 209715200; // 200 MB
            });

            builder.Services.AddEndpointsApiExplorer();

            // ✅ MySQL EF Core (Pomelo)
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseMySql(
                    connectionString,
                    new MySqlServerVersion(new Version(8, 0, 44)),
                    mysqlOptions =>
                    {
                        mysqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(10),
                            errorNumbersToAdd: null
                        );
                    }
                );
            });

            // ✅ JWT Auth
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
            });



            builder.Services.AddAuthorization();

            // ✅ Swagger + JWT Support
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "LMS API", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter: Bearer {your_token}"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] { }
        }
    });
            });

            // ✅ CORS (React Vite)
            builder.Services.AddCors(opt =>
            {
                opt.AddPolicy("AllowFrontend", policy =>
                {
                    policy.AllowAnyHeader()
                          .AllowAnyMethod()
                          .WithOrigins("http://localhost:5173");
                });
            });

            builder.Services.AddScoped<EmailService>();

            builder.Services.AddScoped<S3Service>();



            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors("AllowFrontend");

            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.Run();
        }
    }
}

//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.OpenApi.Models;
//using Online_LMS.Data;
//using Online_LMS.Services;
//using System.Text;

//namespace Online_LMS
//{
//    public class Program
//    {
//        public static void Main(string[] args)
//        {
//            var builder = WebApplication.CreateBuilder(args);

//            // =========================
//            // CONTROLLERS
//            // =========================
//            builder.Services.AddControllers();

//            // =========================
//            // FILE UPLOAD LIMIT (200 MB)
//            // =========================
//            builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
//            {
//                options.MultipartBodyLengthLimit = 209_715_200; // 200 MB
//            });

//            // =========================
//            // SWAGGER
//            // =========================
//            builder.Services.AddEndpointsApiExplorer();
//            builder.Services.AddSwaggerGen(c =>
//            {
//                c.SwaggerDoc("v1", new OpenApiInfo
//                {
//                    Title = "LMS API",
//                    Version = "v1"
//                });

//                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//                {
//                    Name = "Authorization",
//                    Type = SecuritySchemeType.Http,
//                    Scheme = "bearer",
//                    BearerFormat = "JWT",
//                    In = ParameterLocation.Header,
//                    Description = "Enter: Bearer {your JWT token}"
//                });

//                c.AddSecurityRequirement(new OpenApiSecurityRequirement
//                {
//                    {
//                        new OpenApiSecurityScheme
//                        {
//                            Reference = new OpenApiReference
//                            {
//                                Type = ReferenceType.SecurityScheme,
//                                Id = "Bearer"
//                            }
//                        },
//                        Array.Empty<string>()
//                    }
//                });
//            });

//            // =========================
//            // DATABASE (MySQL - SAFE SETUP)
//            // =========================
//            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

//            builder.Services.AddDbContext<AppDbContext>(options =>
//            {
//                options.UseMySql(
//                    connectionString,
//                    new MySqlServerVersion(new Version(8, 0, 44)),
//                    mysqlOptions =>
//                    {
//                        mysqlOptions.EnableRetryOnFailure(
//                            maxRetryCount: 5,
//                            maxRetryDelay: TimeSpan.FromSeconds(10),
//                            errorNumbersToAdd: null
//                        );
//                    }
//                );
//            });

//            // =========================
//            // JWT AUTHENTICATION
//            // =========================
//            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
//            var jwtKey = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

//            builder.Services
//                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//                .AddJwtBearer(options =>
//                {
//                    options.TokenValidationParameters = new TokenValidationParameters
//                    {
//                        ValidateIssuer = true,
//                        ValidateAudience = true,
//                        ValidateLifetime = true,
//                        ValidateIssuerSigningKey = true,
//                        ValidIssuer = jwtSettings["Issuer"],
//                        ValidAudience = jwtSettings["Audience"],
//                        IssuerSigningKey = new SymmetricSecurityKey(jwtKey),
//                        ClockSkew = TimeSpan.Zero // 🔒 no token grace time
//                    };
//                });

//            builder.Services.AddAuthorization();

//            // =========================
//            // CORS (React / Vite)
//            // =========================
//            builder.Services.AddCors(options =>
//            {
//                options.AddPolicy("AllowFrontend", policy =>
//                {
//                    policy
//                        .WithOrigins(
//                            "http://localhost:5173",
//                            "http://127.0.0.1:5173"
//                        )
//                        .AllowAnyHeader()
//                        .AllowAnyMethod();
//                });
//            });

//            // =========================
//            // CUSTOM SERVICES
//            // =========================
//            builder.Services.AddScoped<EmailService>();
//            builder.Services.AddScoped<S3Service>();

//            var app = builder.Build();

//            // =========================
//            // MIDDLEWARE PIPELINE
//            // =========================
//            if (app.Environment.IsDevelopment())
//            {
//                app.UseSwagger();
//                app.UseSwaggerUI();
//            }

//            app.UseHttpsRedirection();

//            app.UseCors("AllowFrontend");

//            app.UseStaticFiles();

//            app.UseAuthentication();
//            app.UseAuthorization();

//            app.MapControllers();

//            app.Run();
//        }
//    }
//}
