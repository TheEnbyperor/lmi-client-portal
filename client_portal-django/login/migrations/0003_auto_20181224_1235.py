# Generated by Django 2.1.2 on 2018-12-24 12:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0002_auto_20181224_1235'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='login_token',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='login_token_generated',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]