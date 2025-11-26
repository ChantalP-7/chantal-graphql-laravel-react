<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\ScrapeJob;

class ScrapeSaqCommand extends Command
{
    protected $signature = 'scrape:saq';
    protected $description = 'Lance le scraping SAQ en Job';

    public function handle()
    {
        $this->info('Lancement du scraping dans la queue...');
        ScrapeJob::dispatch()->onQueue('scraping');
        $this->info('Scraping lancé !');
    }
}
