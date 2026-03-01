# ==================== mall-auth-service Dockerfile ====================
# 适配 Java 21

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.cloud.nacos.discovery.server-addr=nacos:8848"]
