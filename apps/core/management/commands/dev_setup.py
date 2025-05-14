# neighborly/management/commands/dev_setup.py

from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Migrate, load JSON fixtures, then seed faker data"

    def handle(self, *args, **opts):
        self.stdout.write("\n==========Migrating database…==========\n")
<<<<<<< HEAD
        call_command('migrate', verbosity=1)

        self.stdout.write("\n==========Loading fixtures…==========\n")
        fixts = [
            'neighborly_users/fixtures/initial_users.json',
            'neighborly_tools/fixtures/initial_tools.json',
            'neighborly_tools/fixtures/initial_borrowrequests.json',
            'neighborly_events/fixtures/initial_events.json',
            'neighborly_events/fixtures/initial_eventsignups.json',
            'neighborly_services/fixtures/initial_services.json',
            'neighborly_petitions/fixtures/initial_petitions.json',
            "neighborly_petitions/fixtures/initial_petition_signatures.json",
            "neighborly_bulletin/fixtures/initial_bulletins.json"
=======
        call_command("migrate", verbosity=1)

        self.stdout.write("\n==========Loading fixtures…==========\n")
        fixts = [
            "neighborly_users/fixtures/initial_users.json",
            "neighborly_tools/fixtures/initial_tools.json",
            "neighborly_tools/fixtures/initial_borrowrequests.json",
            "neighborly_events/fixtures/initial_events.json",
            "neighborly_events/fixtures/initial_eventsignups.json",
            "neighborly_services/fixtures/initial_services.json",
            "neighborly_services/fixtures/initial_servicesignup.json",
            "neighborly_petitions/fixtures/initial_petitions.json",
            "neighborly_petitions/fixtures/initial_petition_signatures.json",
            "neighborly_bulletin/fixtures/initial_bulletins.json",
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
        ]
        for f in fixts:
            call_command("loaddata", f, verbosity=0)

        self.stdout.write(self.style.SUCCESS("\n==========Dev DB ready!=========="))
