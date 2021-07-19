@if ($posts)
    <div class="o-grid">
        @foreach($posts as $post)
            <div class="o-grid-12 {{ $gridColumnClass }}">
                @card([
                    'link' => $post->permalink,
                    'imageFirst' => true,
                    'image' =>  $post->thumbnail,
                    'heading' => $post->postTitle,
                    'classList' => ['t-archive-card', 'u-height--100', 'u-height-100'],
                    'byline' => ['text' => $post->postDate, 'position' => 'body'],
                    'content' => $post->excerptShort,
                    'tags' => $post->termsUnlinked
                ])
                   @slot('meta')
                        @icon(['icon' => 'date_range']) @endicon
                        @date(['action' => 'formatDate', 'format' => 'D d M Y H:i' ,'timestamp' => $post->startDate])@enddate                    
                   @endslot 
                @endcard
            </div>
        @endforeach
    </div>
@endif
