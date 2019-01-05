from django.db import models
import login.models

AREA_TYPES = (
    (1, 'Signature'),
    (2, 'Name'),
    (3, 'Date')
)


class Document(models.Model):
    name = models.CharField(max_length=255)
    document = models.FileField()
    assignees = models.ManyToManyField(login.models.User)

    def __str__(self):
        return self.name


class DocumentArea(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    user = models.ForeignKey(login.models.User, on_delete=models.SET_NULL, null=True)

    top = models.PositiveIntegerField()
    bottom = models.PositiveIntegerField()
    left = models.PositiveIntegerField()
    right = models.PositiveIntegerField()

    type = models.PositiveSmallIntegerField(choices=AREA_TYPES)

    def __str__(self):
        return f"{self.document.name}"


class SingedDocument(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    user = models.ForeignKey(login.models.User, on_delete=models.SET_NULL, null=True)
