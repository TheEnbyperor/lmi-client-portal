from django.db import models


class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()

    login_token = models.CharField(max_length=255, blank=True, null=True)
    login_status_token = models.CharField(max_length=255, blank=True, null=True)
    login_token_generated = models.DateTimeField(blank=True, null=True)
    login_token_authenticated = models.BooleanField(default=False)

    def __str__(self):
        return self.name
