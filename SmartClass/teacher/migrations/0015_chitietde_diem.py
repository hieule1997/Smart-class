# Generated by Django 2.1 on 2018-10-03 01:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teacher', '0014_auto_20181003_0838'),
    ]

    operations = [
        migrations.AddField(
            model_name='chitietde',
            name='diem',
            field=models.FloatField(default=0.25),
            preserve_default=False,
        ),
    ]