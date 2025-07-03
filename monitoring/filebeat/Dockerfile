FROM docker.elastic.co/beats/filebeat:8.9.0

# Copie le fichier de config directement dans l'image
COPY filebeat.yml /usr/share/filebeat/filebeat.yml
USER root
RUN chown root:root /usr/share/filebeat/filebeat.yml && chmod 644 /usr/share/filebeat/filebeat.yml

USER filebeat
