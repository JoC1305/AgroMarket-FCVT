var builder = DistributedApplication.CreateBuilder(args);

var dbserver = builder.AddPostgres("dbserver").WithLifetime(ContainerLifetime.Persistent);

dbserver.WithPgAdmin(options =>
    options.WithHostPort(5555).WithLifetime(ContainerLifetime.Persistent)
);

var db = dbserver.AddDatabase("AgromarketFCVT");

builder.AddProject<Projects.Api>("Api").WithExternalHttpEndpoints().WithReference(db).WaitFor(db);

builder.Build().Run();
